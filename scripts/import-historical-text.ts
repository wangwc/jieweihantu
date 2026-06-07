import fs from "node:fs";
import path from "node:path";
import { claims, sourceRegistry, textChunks } from "../lib/data";
import { extractEntities } from "../lib/import/entity-extractor";
import { suggestClaimLinks } from "../lib/import/link-suggester";
import { detectSourceLayer, matchSource } from "../lib/import/source-matcher";
import { findTextChunkDuplicates } from "../lib/import/dedupe";
import type { ImportRowError, StagingEvidence, StagingSource, StagingTextChunk } from "../lib/types";
import { createBatch, writeStaging } from "./lib/staging";

function arg(name: string) {
  return process.argv.find((item) => item.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
}

const file = arg("file");
if (!file) throw new Error("请提供 --file=本地文本/Markdown/TXT 路径。PDF 需先提取为文本。");
const write = process.argv.includes("--write");
const sourceType = arg("source-type") || "历史文本";
const sourceTitle = arg("source-title") || path.basename(file);
const sourceLayer = detectSourceLayer(sourceType);
const text = fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
const now = new Date().toISOString();
const chunks = text.split(/\n{2,}|。|；|;|\r\n/).map((item) => item.trim()).filter((item) => item.length >= 12).slice(0, 50);
const sourceCandidate = { title: sourceTitle, sourceType, sourceLayer };
const matched = matchSource(sourceCandidate, sourceRegistry);
const batch = createBatch("text-chunk", file, chunks.length, ["Historical Source Pipeline 只写入 staging，不写正式 Evidence。"]);
const rowErrors: ImportRowError[] = [];

const stagingSource: StagingSource = {
  id: `stg-source-${Date.now()}`,
  entityKind: "source",
  importBatchId: batch.id,
  rawPayload: { title: sourceTitle, sourceType },
  normalizedPayload: sourceCandidate,
  detectedSourceLayer: sourceLayer,
  detectedSourceType: sourceType,
  confidence: 0.78,
  duplicateCandidateIds: matched.duplicateCandidateIds,
  suggestedLinks: [],
  validationWarnings: matched.duplicateCandidateIds.length ? ["检测到可能重复来源，建议人工合并。"] : [],
  validationErrors: [],
  reviewStatus: "pending_review",
  reviewerNote: "来源候选需审核后才能写入 SourceRegistry。",
  demoOnly: false,
  createdAt: now,
  updatedAt: now
};

const stagingTextChunks: StagingTextChunk[] = chunks.map((chunk, index) => {
  const entities = extractEntities(chunk);
  return {
    id: `stg-textchunk-${Date.now()}-${index + 1}`,
    entityKind: "text-chunk",
    importBatchId: batch.id,
    rawPayload: { originalText: chunk },
    normalizedPayload: {
      sourceId: matched.matchedSourceId || stagingSource.id,
      title: `${sourceTitle} 片段 ${index + 1}`,
      originalText: chunk,
      keywords: entities.keywords,
      personIds: entities.persons,
      placeIds: entities.places,
      candidateClaimIds: suggestClaimLinks(chunk, claims).map((link) => link.entityId)
    },
    detectedSourceLayer: sourceLayer,
    detectedSourceType: sourceType,
    confidence: 0.75,
    duplicateCandidateIds: findTextChunkDuplicates(chunk, textChunks),
    suggestedLinks: suggestClaimLinks(chunk, claims),
    validationWarnings: ["TextChunk 不等于 Evidence；需审核后生成候选证据。"],
    validationErrors: [],
    reviewStatus: "pending_review",
    reviewerNote: "待人工确认 citation、licenseNote 和 Claim 关联。",
    demoOnly: false,
    createdAt: now,
    updatedAt: now
  };
});

const stagingEvidence: StagingEvidence[] = stagingTextChunks.map((chunk) => ({
  id: `stg-evidence-${chunk.id}`,
  entityKind: "evidence",
  importBatchId: batch.id,
  rawPayload: { fromTextChunkId: chunk.id },
  normalizedPayload: {
    sourceId: String(chunk.normalizedPayload.sourceId || ""),
    claimId: chunk.suggestedLinks[0]?.entityId || "",
    relationToClaim: "提供背景",
    originalText: chunk.normalizedPayload.originalText,
    verificationStatus: "未审核"
  },
  detectedSourceLayer: sourceLayer,
  detectedSourceType: sourceType,
  confidence: chunk.confidence,
  duplicateCandidateIds: [],
  suggestedLinks: chunk.suggestedLinks,
  validationWarnings: ["候选 Evidence 不得直接进入正式 evidence.json。"],
  validationErrors: [],
  reviewStatus: "pending_review",
  reviewerNote: "需通过 promoteTextChunkToEvidence 或审核动作。",
  demoOnly: false,
  createdAt: now,
  updatedAt: now
}));

writeStaging("sources.json", [stagingSource], batch, rowErrors, write);
writeStaging("text-chunks.json", stagingTextChunks, batch, rowErrors, write);
writeStaging("evidence.json", stagingEvidence, batch, rowErrors, write);
