import fs from "node:fs";
import path from "node:path";
import { claims } from "../lib/data";
import { decomposeAlternativeNarrative } from "../lib/alternative-narrative";
import { classifyRisk } from "../lib/import/risk-classifier";
import { suggestClaimLinks } from "../lib/import/link-suggester";
import type { ImportRowError, StagingClaim, StagingLead } from "../lib/types";
import { createBatch, writeStaging } from "./lib/staging";

function arg(name: string) {
  return process.argv.find((item) => item.startsWith(`--${name}=`))?.split("=").slice(1).join("=") || "";
}

const file = arg("file");
if (!file) throw new Error("请提供 --file=URL摘要/文章/字幕/论坛文本。");
const write = process.argv.includes("--write");
const text = fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
const platform = (arg("platform") || "其他") as any;
const kind = (arg("kind") || "article") as any;
const url = arg("url") || "https://example.org/controversial-lead";
const leadId = arg("lead-id") || `lead-staging-${Date.now()}`;
const now = new Date().toISOString();
const risk = classifyRisk(text, "D");
const batch = createBatch("controversial-claim", file, 1, ["Controversial Claim Pipeline 只写 staging 和候选，不写正式事实层。"]);
const rowErrors: ImportRowError[] = [];
const decomposition = decomposeAlternativeNarrative({ leadId, sourceUrl: url, sourceKind: kind, platform, text, createdAt: now });

const stagingLead: StagingLead = {
  id: `stg-${leadId}`,
  entityKind: "lead",
  importBatchId: batch.id,
  rawPayload: { text, url, platform, kind },
  normalizedPayload: {
    id: leadId,
    platform,
    title: arg("title") || `争议线索 ${path.basename(file)}`,
    url,
    rawSummary: text.slice(0, 240),
    status: "待核验",
    riskLevel: risk.riskLevel,
    riskNote: risk.warnings.join("；") || "网络资料仅作为线索。"
  },
  detectedSourceLayer: "D",
  detectedSourceType: "争议网络线索",
  confidence: 0.72,
  duplicateCandidateIds: [],
  suggestedLinks: suggestClaimLinks(text, claims),
  validationWarnings: ["D/X 级网络资料不能生成正式 Claim 结论。", ...risk.warnings],
  validationErrors: [],
  reviewStatus: "pending_review",
  reviewerNote: "审核后才可转入 ControversialClaim；不得直接进入事实层。",
  demoOnly: false,
  createdAt: now,
  updatedAt: now
};

const stagingClaims: StagingClaim[] = decomposition.claims.map((claim) => ({
  id: `stg-${claim.id}`,
  entityKind: "claim",
  importBatchId: batch.id,
  rawPayload: { rawClaimText: claim.rawClaimText },
  normalizedPayload: { title: claim.title, topic: claim.topic === "未分类" ? "争议事件" : claim.topic, controversial: true },
  detectedSourceLayer: "D",
  detectedSourceType: "争议主张候选",
  confidence: 0.68,
  duplicateCandidateIds: suggestClaimLinks(claim.normalizedClaim, claims).map((link) => link.entityId),
  suggestedLinks: suggestClaimLinks(claim.normalizedClaim, claims),
  validationWarnings: ["争议 Claim 默认 pending_review；只能生成待补证据任务。"],
  validationErrors: [],
  reviewStatus: "pending_review",
  reviewerNote: "需要审核后进入 ControversialClaim Studio。",
  demoOnly: false,
  createdAt: now,
  updatedAt: now
}));

writeStaging("leads.json", [stagingLead], batch, rowErrors, write);
writeStaging("claims.json", stagingClaims, batch, rowErrors, write);
console.log(JSON.stringify({ generatedControversialClaims: decomposition.claims, generatedTasks: decomposition.tasks }, null, 2));
