import { claims } from "../lib/data";
import type { LeadItem } from "../lib/types";
import { runImport } from "./lib/importer";

const now = () => new Date().toISOString();
const claimIds = new Set(claims.map((claim) => claim.id));

runImport<LeadItem>({
  inputPath: "",
  targetFile: "leads.json",
  entityType: "lead",
  mapRow: (row) => ({
    id: String(row.id || ""),
    platform: String(row.platform || "其他") as LeadItem["platform"],
    title: String(row.title || ""),
    url: String(row.url || ""),
    author: String(row.author || ""),
    publishDate: String(row.publishDate || ""),
    capturedAt: String(row.capturedAt || now()),
    rawSummary: String(row.rawSummary || ""),
    extractedClaims: String(row.extractedClaims || "").split("|").filter(Boolean),
    mentionedSources: String(row.mentionedSources || "").split("|").filter(Boolean),
    relatedClaimIds: String(row.relatedClaimIds || "").split("|").filter(Boolean),
    status: String(row.status || "待核验") as LeadItem["status"],
    riskLevel: String(row.riskLevel || "medium") as LeadItem["riskLevel"],
    riskNote: String(row.riskNote || "网络线索不能直接作为历史结论。"),
    reviewerNote: String(row.reviewerNote || ""),
    thumbnailUrl: String(row.thumbnailUrl || ""),
    embedUrl: String(row.embedUrl || ""),
    mediaAssets: [],
    platformPolicyNote: String(row.platformPolicyNote || "仅人工录入公开链接，不绕过平台限制。"),
    demoOnly: String(row.demoOnly || "true") !== "false",
    createdAt: String(row.createdAt || now()),
    updatedAt: String(row.updatedAt || now())
  }),
  validateRows: (rows) => ({
    errors: rows.flatMap((row) => [
      !row.id ? "线索缺少 id" : "",
      !row.title ? `线索 ${row.id} 缺少 title` : "",
      ...row.relatedClaimIds.filter((id) => !claimIds.has(id)).map((id) => `线索 ${row.id} 引用不存在的 claimId：${id}`)
    ].filter(Boolean)),
    warnings: rows.flatMap((row) => (!row.rawSummary ? [`线索 ${row.id} 缺少 rawSummary`] : []))
  })
});
