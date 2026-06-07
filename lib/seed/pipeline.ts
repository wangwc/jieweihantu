import fs from "node:fs";
import path from "node:path";
import type { ImportBatch, ImportRowError, StagingArtifact, StagingClaim, StagingEvidence, StagingLead, StagingPerson, StagingSource, StagingTerritory, StagingTextChunk } from "@/lib/types";
import type { SeedAdapter, SeedBuildReport, SeedReportIssue, SeedSourceConfig } from "@/lib/seed/types";
import { dataPath, ensureDir, readJsonFile, readSeedSources, seedDir, seedPath, upsertById, writeJsonFile } from "@/lib/seed/fs";
import { chgisAdapter } from "@/data-seed/adapters/chgis-adapter";
import { cbdbAdapter } from "@/data-seed/adapters/cbdb-adapter";
import { controversialUrlListAdapter } from "@/data-seed/adapters/controversial-url-list-adapter";
import { localFileAdapter } from "@/data-seed/adapters/local-file-adapter";
import { mediawikiTextAdapter } from "@/data-seed/adapters/mediawiki-text-adapter";
import { museumAdapter } from "@/data-seed/adapters/museum-adapter";

const adapterMap: Record<string, SeedAdapter> = {
  chgis: chgisAdapter,
  cbdb: cbdbAdapter,
  museum: museumAdapter,
  "mediawiki-text": mediawikiTextAdapter,
  "controversial-url-list": controversialUrlListAdapter,
  "local-file": localFileAdapter
};

function nowId(prefix: string) {
  return `${prefix}-${new Date().toISOString().replace(/[-:.TZ]/g, "")}`;
}

function contextFor(source: SeedSourceConfig, allowNetwork: boolean) {
  return {
    source,
    allowNetwork,
    importBatchId: `batch-seed-${source.id}`,
    now: new Date().toISOString()
  };
}

function writeReport(name: string, report: unknown) {
  writeJsonFile(seedPath("reports", name), report);
}

function readNormalized<T>(fileName: string) {
  return readJsonFile<T[]>(seedPath("normalized", fileName), []);
}

function writeNormalized(fileName: string, rows: Record<string, unknown>[]) {
  writeJsonFile(seedPath("normalized", fileName), rows);
}

function sourceOutputFile(source: SeedSourceConfig) {
  if (source.adapter === "controversial-url-list") return "claims.json";
  if (source.adapter === "mediawiki-text" || source.adapter === "local-file") return "text_chunks.json";
  if (source.adapter === "chgis") return "territory.json";
  if (source.adapter === "cbdb") return "persons.json";
  if (source.adapter === "museum") return "artifacts.json";
  return "records.json";
}

export async function seedFetch(allowNetwork = false) {
  const sources = readSeedSources().filter((source) => source.enabled);
  const warnings: SeedReportIssue[] = [];
  const errors: SeedReportIssue[] = [];
  for (const source of sources) {
    const adapter = adapterMap[source.adapter];
    if (!adapter) {
      errors.push({ id: `adapter-${source.id}`, sourceId: source.id, severity: "error", message: `Missing adapter: ${source.adapter}` });
      continue;
    }
    const context = contextFor(source, allowNetwork);
    if (source.input.startsWith("http") && !allowNetwork) {
      warnings.push({ id: `offline-${source.id}`, sourceId: source.id, filePath: source.input, severity: "warning", message: "Network fetch skipped. Pass --allow-network to fetch public URLs." });
      continue;
    }
    const result = await adapter.fetch(context);
    for (const row of result.normalizedRecords) {
      const filePathOrUrl = String(row.filePathOrUrl || "");
      if (filePathOrUrl && !filePathOrUrl.startsWith("http")) {
        const absolute = path.isAbsolute(filePathOrUrl) ? filePathOrUrl : path.join(process.cwd(), filePathOrUrl);
        if (!fs.existsSync(absolute)) {
          warnings.push({
            id: `missing-raw-${source.id}-${row.id || filePathOrUrl}`,
            sourceId: source.id,
            filePath: filePathOrUrl,
            severity: "warning",
            message: "Manifest points to a local raw file that is not present. The seed flow will report it and continue."
          });
        }
      }
    }
    warnings.push(...result.warnings);
    errors.push(...result.errors);
    await adapter.writeReports(context, result);
  }
  const report: SeedBuildReport = {
    id: nowId("seed-fetch"),
    generatedAt: new Date().toISOString(),
    allowNetwork,
    sources: sources.map((source) => ({ id: source.id, name: source.name, enabled: source.enabled, adapter: source.adapter, status: "checked" })),
    warnings,
    errors
  };
  writeReport("missing-data-report.json", warnings.filter((issue) => issue.id.startsWith("missing") || issue.id.startsWith("offline")));
  writeReport("seed-build-report.json", report);
  return report;
}

export async function seedNormalize() {
  const sources = readSeedSources().filter((source) => source.enabled);
  const buckets: Record<string, Record<string, unknown>[]> = {
    "sources.json": [],
    "persons.json": [],
    "territory.json": [],
    "artifacts.json": [],
    "text_chunks.json": [],
    "leads.json": [],
    "claims.json": [],
    "evidence_candidates.json": [],
    "research_tasks.json": []
  };
  const warnings: SeedReportIssue[] = [];
  const errors: SeedReportIssue[] = [];

  for (const source of sources) {
    const adapter = adapterMap[source.adapter];
    if (!adapter) continue;
    const context = contextFor(source, false);
    const result = await adapter.normalize(context);
    buckets["sources.json"].push(...adapter.getSourceRegistryRecords(context));
    buckets[sourceOutputFile(source)].push(...result.normalizedRecords);
    warnings.push(...result.warnings);
    errors.push(...result.errors);
    if (source.adapter === "controversial-url-list") {
      for (const claim of result.normalizedRecords) {
        buckets["leads.json"].push({
          id: `seed-lead-${claim.id}`,
          importBatchId: claim.importBatchId,
          sourceId: claim.sourceId,
          platform: claim.sourcePlatform,
          title: claim.sourceTitle || claim.title,
          url: claim.sourceUrl,
          rawSummary: claim.rawSummary,
          extractedClaims: [claim.title],
          reviewStatus: "pending_review",
          defaultLayer: "D/X",
          licenseNote: claim.licenseNote,
          citation: claim.citation,
          demoOnly: true
        });
        buckets["research_tasks.json"].push(
          {
            id: `task-${claim.id}-source`,
            claimId: claim.id,
            taskType: "补原始材料",
            description: `查找并核验「${claim.title}」相关 S/A/B/C 级原始材料。`,
            recommendedSourceLayer: "S/A/B/C",
            recommendedSourceTypes: "实录、档案、文物、现代研究",
            priority: claim.riskLevel === "high" ? "high" : "medium",
            status: "待补资料",
            notes: "由 seed builder 自动生成，不能直接作为结论。"
          },
          {
            id: `task-${claim.id}-counter`,
            claimId: claim.id,
            taskType: "补反证材料",
            description: `查找能够支持、限制或反驳「${claim.title}」的独立证据。`,
            recommendedSourceLayer: "S/A/B/C",
            recommendedSourceTypes: "多源交叉材料",
            priority: "medium",
            status: "待补资料",
            notes: "所有自动关联只进入 suggestedLinks。"
          }
        );
      }
    }
  }

  Object.entries(buckets).forEach(([fileName, rows]) => writeNormalized(fileName, rows));
  writeReport("seed-normalize-report.json", { generatedAt: new Date().toISOString(), counts: Object.fromEntries(Object.entries(buckets).map(([key, rows]) => [key, rows.length])), warnings, errors });
  return buckets;
}

function addSuggestedLinks<T extends Record<string, unknown>>(rows: T[], claims: Record<string, unknown>[]) {
  return rows.map((row) => {
    const text = `${row.title || ""} ${row.topic || ""} ${row.pageTitle || ""}`;
    const links = claims
      .filter((claim) => text && String(claim.title || "").split(/[，、\s]/).some((part) => part && text.includes(part)))
      .slice(0, 3)
      .map((claim) => ({ entityType: "claim", entityId: claim.id, label: claim.title, reason: "seed keyword overlap", confidence: 0.45 }));
    return { ...row, suggestedLinks: links };
  });
}

export async function seedLink() {
  const claims = readNormalized<Record<string, unknown>>("claims.json");
  const textChunks = addSuggestedLinks(readNormalized<Record<string, unknown>>("text_chunks.json"), claims);
  const territory = addSuggestedLinks(readNormalized<Record<string, unknown>>("territory.json"), claims);
  const artifacts = addSuggestedLinks(readNormalized<Record<string, unknown>>("artifacts.json"), claims);
  const persons = addSuggestedLinks(readNormalized<Record<string, unknown>>("persons.json"), claims);
  writeNormalized("text_chunks.json", textChunks);
  writeNormalized("territory.json", territory);
  writeNormalized("artifacts.json", artifacts);
  writeNormalized("persons.json", persons);
  const report = { generatedAt: new Date().toISOString(), textChunkLinks: textChunks.reduce((sum, row) => sum + ((row.suggestedLinks as unknown[])?.length || 0), 0) };
  writeReport("duplicate-report.json", { generatedAt: report.generatedAt, duplicates: [] });
  writeReport("source-coverage-report.json", report);
  return report;
}

export async function seedValidate() {
  const files = ["sources.json", "persons.json", "territory.json", "artifacts.json", "text_chunks.json", "leads.json", "claims.json", "evidence_candidates.json", "research_tasks.json"];
  const errors: SeedReportIssue[] = [];
  const warnings: SeedReportIssue[] = [];
  for (const file of files) {
    for (const row of readNormalized<Record<string, unknown>>(file)) {
      const id = String(row.id || `${file}-unknown`);
      if (file !== "sources.json" && !row.sourceId && !row.claimId) errors.push({ id: `source-${id}`, severity: "error", message: `${id} missing sourceId or claimId` });
      if (file !== "sources.json" && !row.importBatchId && file !== "research_tasks.json") errors.push({ id: `batch-${id}`, severity: "error", message: `${id} missing importBatchId` });
      if (file !== "research_tasks.json" && !row.licenseNote && file !== "claims.json") warnings.push({ id: `license-${id}`, severity: "warning", message: `${id} missing licenseNote` });
      if (file !== "research_tasks.json" && !row.citation && !row.url && !row.sourceUrl) warnings.push({ id: `citation-${id}`, severity: "warning", message: `${id} missing citation or url` });
      if (file === "claims.json" && row.reviewStatus !== "pending_review") errors.push({ id: `review-${id}`, severity: "error", message: `${id} must stay pending_review` });
      if (file === "claims.json" && row.conclusion !== "不作为事实结论") errors.push({ id: `conclusion-${id}`, severity: "error", message: `${id} cannot be a fact conclusion` });
      if (file === "text_chunks.json" && row.originalText !== "待补原文" && row.reviewStatus !== "pending_review") warnings.push({ id: `chunk-${id}`, severity: "warning", message: `${id} TextChunk still requires review before Evidence promotion` });
    }
  }
  if (readNormalized("claims.json").length < 60) errors.push({ id: "claim-count", severity: "error", message: "Expected at least 60 controversial claim seeds." });
  if (readNormalized("text_chunks.json").length < 120) errors.push({ id: "page-list-count", severity: "error", message: "Expected at least 120 historical text page-list seeds." });
  const report = { ok: errors.length === 0, generatedAt: new Date().toISOString(), errors, warnings };
  writeReport("validation-report.json", report);
  return report;
}

export async function seedSnapshot() {
  const snapshot = {
    id: nowId("seed-snapshot"),
    createdAt: new Date().toISOString(),
    data: Object.fromEntries(["sources.json", "leads.json", "claims.json", "evidence.json", "text-chunks.json", "artifacts.json", "persons.json", "territory-layers.json", "import-batches.json", "import-row-errors.json"].map((file) => [file, readJsonFile(dataPath(file), [])])),
    staging: Object.fromEntries(["sources.json", "leads.json", "claims.json", "evidence.json", "text-chunks.json", "artifacts.json", "persons.json", "territory.json"].map((file) => [file, readJsonFile(dataPath("staging", file), [])]))
  };
  writeJsonFile(seedPath("snapshots", "seed-snapshot.latest.json"), snapshot);
  return snapshot;
}

function stagingBase(row: Record<string, unknown>, entityKind: string, now: string) {
  return {
    id: `stg-${row.id}`,
    entityKind,
    importBatchId: row.importBatchId,
    rawPayload: row,
    normalizedPayload: row,
    detectedSourceLayer: entityKind === "lead" || entityKind === "claim" ? "D" : row.expectedLayer || row.sourceLayer || "C",
    detectedSourceType: "seed",
    confidence: 0.5,
    duplicateCandidateIds: [],
    suggestedLinks: row.suggestedLinks || [],
    validationWarnings: row.validationWarnings || [],
    validationErrors: [],
    reviewStatus: "pending_review",
    reviewerNote: "Seed Builder generated; manual review required.",
    demoOnly: true,
    createdAt: now,
    updatedAt: now
  };
}

export async function seedImport(mode = "staging") {
  const now = new Date().toISOString();
  const batches = readJsonFile<ImportBatch[]>(dataPath("import-batches.json"), []);
  const batch: ImportBatch = {
    id: `batch-seed-import-${Date.now()}`,
    importType: "json",
    entityType: "staging",
    fileName: "data-seed/normalized",
    importedAt: now,
    importedBy: "seed-builder",
    totalRows: 0,
    successRows: 0,
    failedRows: 0,
    warnings: mode === "trusted-open-data" ? ["trusted-open-data only imports Person/Territory/Artifact as formal structured records."] : [],
    errors: [],
    status: "success",
    rawFilePath: "data-seed/normalized",
    resultFilePath: mode === "staging" ? "data/staging" : "data",
    demoOnly: true
  };

  const targets: Array<[string, string, Record<string, unknown>[]]> = [
    ["staging/sources.json", "source", readNormalized("sources.json")],
    ["staging/leads.json", "lead", readNormalized("leads.json")],
    ["staging/claims.json", "claim", readNormalized("claims.json")],
    ["staging/evidence.json", "evidence", readNormalized("evidence_candidates.json")],
    ["staging/text-chunks.json", "text-chunk", readNormalized("text_chunks.json")],
    ["staging/artifacts.json", "artifact", readNormalized("artifacts.json")],
    ["staging/territory.json", "territory", readNormalized("territory.json")],
    ["staging/persons.json", "person", readNormalized("persons.json")]
  ];

  if (mode === "staging") {
    for (const [file, kind, rows] of targets) {
      const staged = rows.map((row) => stagingBase(row, kind, now));
      writeJsonFile(dataPath(file), upsertById(readJsonFile<any[]>(dataPath(file), []), staged as any[]));
      batch.totalRows += staged.length;
      batch.successRows += staged.length;
    }
  } else if (mode === "trusted-open-data") {
    writeJsonFile(dataPath("persons.json"), upsertById(readJsonFile<any[]>(dataPath("persons.json"), []), readNormalized("persons.json") as any[]));
    writeJsonFile(dataPath("artifacts.json"), upsertById(readJsonFile<any[]>(dataPath("artifacts.json"), []), readNormalized("artifacts.json") as any[]));
    writeJsonFile(dataPath("territory-layers.json"), upsertById(readJsonFile<any[]>(dataPath("territory-layers.json"), []), readNormalized("territory.json") as any[]));
    batch.totalRows = readNormalized("persons.json").length + readNormalized("artifacts.json").length + readNormalized("territory.json").length;
    batch.successRows = batch.totalRows;
  } else {
    throw new Error(`Unsupported seed import mode: ${mode}`);
  }

  writeJsonFile(dataPath("import-batches.json"), upsertById(batches, [batch]));
  writeJsonFile(dataPath("import-row-errors.json"), readJsonFile<ImportRowError[]>(dataPath("import-row-errors.json"), []));
  writeReport("seed-import-report.json", { mode, batch });
  return batch;
}

export async function seedRankings() {
  const claims = readNormalized<Record<string, unknown>>("claims.json");
  const tasks = readNormalized<Record<string, unknown>>("research_tasks.json");
  const rows = claims.map((claim) => {
    const taskCount = tasks.filter((task) => task.claimId === claim.id).length;
    const risk = claim.riskLevel === "high" ? 80 : claim.riskLevel === "medium" ? 55 : 35;
    return {
      id: claim.id,
      title: claim.title,
      networkHeatScore: risk + taskCount * 4,
      evidenceGapScore: 50 + taskCount * 8,
      reviewPriorityScore: risk + taskCount * 5,
      highRiskScore: risk,
      highValueEvidenceScore: 40 + taskCount * 10,
      note: "热度不等于可信度；pending_review 不增加事实可信度。"
    };
  });
  const report = {
    generatedAt: new Date().toISOString(),
    networkHeat: [...rows].sort((a, b) => b.networkHeatScore - a.networkHeatScore).slice(0, 20),
    evidenceGap: [...rows].sort((a, b) => b.evidenceGapScore - a.evidenceGapScore).slice(0, 20),
    reviewPriority: [...rows].sort((a, b) => b.reviewPriorityScore - a.reviewPriorityScore).slice(0, 20),
    highRisk: [...rows].sort((a, b) => b.highRiskScore - a.highRiskScore).slice(0, 20),
    highValueEvidence: [...rows].sort((a, b) => b.highValueEvidenceScore - a.highValueEvidenceScore).slice(0, 20)
  };
  writeReport("seed-rankings-report.json", report);
  return report;
}

export async function seedRollback() {
  const snapshot = readJsonFile<any>(seedPath("snapshots", "seed-snapshot.latest.json"), null);
  if (!snapshot) throw new Error("No seed snapshot found.");
  for (const [file, rows] of Object.entries(snapshot.data || {})) writeJsonFile(dataPath(file), rows);
  for (const [file, rows] of Object.entries(snapshot.staging || {})) writeJsonFile(dataPath("staging", file), rows);
  writeReport("seed-rollback-report.json", { rolledBackAt: new Date().toISOString(), snapshotId: snapshot.id });
  return snapshot;
}

export async function seedBuild(allowNetwork = false, mode = "staging") {
  ensureDir(seedDir);
  await seedFetch(allowNetwork);
  await seedNormalize();
  await seedLink();
  const validation = await seedValidate();
  if (!validation.ok) return { ok: false, validation };
  await seedSnapshot();
  const imported = await seedImport(mode);
  const rankings = await seedRankings();
  return { ok: true, imported, rankings };
}
