import { claims, sourceRegistry } from "../lib/data";
import type { EvidenceItem, SourceLayer } from "../lib/types";
import { runImport } from "./lib/importer";

const now = () => new Date().toISOString();
const claimIds = new Set(claims.map((claim) => claim.id));
const sourceIds = new Set(sourceRegistry.map((source) => source.id));

runImport<EvidenceItem>({
  inputPath: "",
  targetFile: "evidence.json",
  entityType: "evidence",
  mapRow: (row) => ({
    id: String(row.id || ""),
    claimId: String(row.claimId || ""),
    sourceId: String(row.sourceId || ""),
    relationToClaim: String(row.relationToClaim || "仅作为线索") as EvidenceItem["relationToClaim"],
    sourceLayer: String(row.sourceLayer || "X") as SourceLayer,
    sourceType: String(row.sourceType || ""),
    title: String(row.title || ""),
    authorOrInstitution: String(row.authorOrInstitution || ""),
    dynastyOrDate: String(row.dynastyOrDate || ""),
    originalText: String(row.originalText || "待录入原文"),
    translationOrSummary: String(row.translationOrSummary || ""),
    url: String(row.url || ""),
    archiveUrl: String(row.archiveUrl || ""),
    screenshotOrArchiveUrl: String(row.screenshotOrArchiveUrl || ""),
    screenshotOrImageUrl: String(row.screenshotOrImageUrl || ""),
    locationRef: String(row.locationRef || "待补位置"),
    citation: String(row.citation || ""),
    licenseNote: String(row.licenseNote || ""),
    reliabilityNote: String(row.reliabilityNote || ""),
    extractionNote: String(row.extractionNote || ""),
    reviewerNote: String(row.reviewerNote || ""),
    verificationStatus: String(row.verificationStatus || "未审核") as EvidenceItem["verificationStatus"],
    auditTrail: [],
    mediaAssets: [],
    hasImage: String(row.hasImage || "false") === "true",
    hasVideo: String(row.hasVideo || "false") === "true",
    hasEmbeddableMedia: String(row.hasEmbeddableMedia || "false") === "true",
    demoOnly: String(row.demoOnly || "true") !== "false",
    createdAt: String(row.createdAt || now()),
    updatedAt: String(row.updatedAt || now())
  }),
  validateRows: (rows) => ({
    errors: rows.flatMap((row) => [
      !row.id ? "证据缺少 id" : "",
      !claimIds.has(row.claimId) ? `证据 ${row.id} claimId 不存在：${row.claimId}` : "",
      !sourceIds.has(row.sourceId) ? `证据 ${row.id} sourceId 不存在：${row.sourceId}` : "",
      (row.sourceLayer === "D" || row.sourceLayer === "X") && row.relationToClaim !== "仅作为线索" ? `证据 ${row.id} 为 ${row.sourceLayer} 级，只能标为“仅作为线索”` : "",
      row.sourceLayer === "Q" && (row.relationToClaim === "反驳清修叙事" || row.relationToClaim === "部分反驳") ? `证据 ${row.id} 为 Q 级，不得作为事实反证` : "",
      !row.licenseNote ? `证据 ${row.id} 缺少 licenseNote` : ""
    ].filter(Boolean)),
    warnings: rows.flatMap((row) => (!row.citation ? [`证据 ${row.id} 缺少 citation`] : []))
  })
});
