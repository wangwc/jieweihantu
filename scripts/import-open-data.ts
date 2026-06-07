import { readInput } from "./lib/io";
import { createBatch, writeStaging } from "./lib/staging";
import type { ImportRowError, StagingArtifact, StagingPerson, StagingTerritory } from "../lib/types";

function arg(name: string) {
  return process.argv.find((item) => item.startsWith(`--${name}=`))?.split("=").slice(1).join("=") || "";
}

const file = arg("file");
const scriptName = process.argv[1] || "";
const defaultEntity = scriptName.includes("chgis") ? "territory" : scriptName.includes("cbdb") ? "person" : "artifact";
const entity = arg("entity") || defaultEntity;
if (!file) throw new Error("请提供 --file=开放数据 CSV/JSON。");
const rows = readInput(file) as Record<string, unknown>[];
const write = process.argv.includes("--write");
const now = new Date().toISOString();
const batch = createBatch(entity === "person" ? "person" : entity === "territory" ? "territory" : "artifact", file, rows.length, ["Open Data Pipeline 只写 staging。"]);
const rowErrors: ImportRowError[] = [];

if (entity === "person") {
  const data: StagingPerson[] = rows.map((row, index) => ({
    id: `stg-person-open-${Date.now()}-${index + 1}`,
    entityKind: "person",
    importBatchId: batch.id,
    rawPayload: row,
    normalizedPayload: { name: String(row.name || row.title || "待命名人物"), dynastyOrDate: String(row.dynastyOrDate || "待补") },
    detectedSourceLayer: "C",
    detectedSourceType: "人物开放数据",
    confidence: 0.6,
    duplicateCandidateIds: [],
    suggestedLinks: [],
    validationWarnings: ["人物开放数据需审核来源和引用。"],
    validationErrors: [],
    reviewStatus: "pending_review",
    reviewerNote: "审核后才能进入 PersonProfile。",
    demoOnly: String(row.demoOnly || "true") !== "false",
    createdAt: now,
    updatedAt: now
  }));
  writeStaging("persons.json", data, batch, rowErrors, write);
} else if (entity === "territory") {
  const data: StagingTerritory[] = rows.map((row, index) => ({
    id: `stg-territory-open-${Date.now()}-${index + 1}`,
    entityKind: "territory",
    importBatchId: batch.id,
    rawPayload: row,
    normalizedPayload: { title: String(row.title || "待命名地点"), controlType: String(row.controlType || "争议区") as any },
    detectedSourceLayer: "C",
    detectedSourceType: "地理开放数据",
    confidence: 0.62,
    duplicateCandidateIds: [],
    suggestedLinks: [],
    validationWarnings: ["Territory 必须保留 controlType。"],
    validationErrors: [],
    reviewStatus: "pending_review",
    reviewerNote: "审核后才能进入 TerritoryLayer。",
    demoOnly: String(row.demoOnly || "true") !== "false",
    createdAt: now,
    updatedAt: now
  }));
  writeStaging("territory.json", data, batch, rowErrors, write);
} else {
  const data: StagingArtifact[] = rows.map((row, index) => ({
    id: `stg-artifact-open-${Date.now()}-${index + 1}`,
    entityKind: "artifact",
    importBatchId: batch.id,
    rawPayload: row,
    normalizedPayload: { title: String(row.title || "待命名文物"), institution: String(row.institution || "待补机构"), licenseNote: String(row.licenseNote || "") },
    detectedSourceLayer: "A",
    detectedSourceType: "博物馆开放数据",
    confidence: 0.64,
    duplicateCandidateIds: [],
    suggestedLinks: [],
    validationWarnings: ["Artifact 必须有 licenseNote。"],
    validationErrors: !row.licenseNote ? ["缺少 licenseNote"] : [],
    reviewStatus: "pending_review",
    reviewerNote: "审核后才能进入 Artifact。",
    demoOnly: String(row.demoOnly || "true") !== "false",
    createdAt: now,
    updatedAt: now
  }));
  writeStaging("artifacts.json", data, batch, rowErrors, write);
}
