import type { AuditRecord, EvidenceItem, HistoricalClaim } from "../lib/types";
import { readJson, writeJson } from "./lib/io";

type ReviewAction =
  | "approve"
  | "reject"
  | "merge"
  | "promoteTextChunkToEvidence"
  | "promoteLeadToClaim"
  | "linkEvidenceToClaim"
  | "linkArtifactToClaim"
  | "linkTerritoryToClaim"
  | "linkPersonToClaim";

function arg(name: string) {
  return process.argv.find((item) => item.startsWith(`--${name}=`))?.split("=").slice(1).join("=") || "";
}

function requireArg(name: string) {
  const value = arg(name);
  if (!value) throw new Error(`Missing required argument --${name}=...`);
  return value;
}

function normalizeAction(raw: string): ReviewAction {
  const aliases: Record<string, ReviewAction> = {
    approveStagingItem: "approve",
    rejectStagingItem: "reject",
    mergeStagingItem: "merge"
  };
  const action = aliases[raw] || raw;
  const allowed: ReviewAction[] = [
    "approve",
    "reject",
    "merge",
    "promoteTextChunkToEvidence",
    "promoteLeadToClaim",
    "linkEvidenceToClaim",
    "linkArtifactToClaim",
    "linkTerritoryToClaim",
    "linkPersonToClaim"
  ];
  if (!allowed.includes(action as ReviewAction)) throw new Error(`Unsupported action: ${raw}`);
  return action as ReviewAction;
}

const action = normalizeAction(requireArg("action"));
const id = requireArg("id");
const reviewer = arg("reviewer") || "local-reviewer";
const now = new Date().toISOString();

function audit(
  entityType: AuditRecord["entityType"],
  entityId: string,
  note: string,
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null
) {
  const records = readJson<AuditRecord[]>("audit-records.json");
  const auditAction: AuditRecord["action"] =
    action === "reject" ? "reject" : action === "merge" || action.startsWith("link") ? "update" : "approve";
  records.push({
    id: `audit-${Date.now()}-${entityId}`,
    entityType,
    entityId,
    action: auditAction,
    before,
    after,
    note,
    reviewer,
    createdAt: now
  });
  writeJson("audit-records.json", records);
}

function updateStagingStatus() {
  const files = ["sources", "leads", "claims", "evidence", "text-chunks", "artifacts", "territory", "persons"];
  for (const file of files) {
    const rows = readJson<any[]>(`staging/${file}.json`);
    const index = rows.findIndex((row) => row.id === id);
    if (index >= 0) {
      const before = rows[index];
      rows[index] = {
        ...rows[index],
        reviewStatus: action === "approve" ? "approved" : action === "reject" ? "rejected" : "merged",
        reviewerNote: arg("note") || rows[index].reviewerNote,
        updatedAt: now
      };
      writeJson(`staging/${file}.json`, rows);
      audit("staging", id, `Staging item ${action}`, before, rows[index]);
      console.log(JSON.stringify(rows[index], null, 2));
      return;
    }
  }
  throw new Error(`Staging item not found: ${id}`);
}

function promoteTextChunkToEvidence() {
  const chunks = readJson<any[]>("staging/text-chunks.json");
  const chunk = chunks.find((item) => item.id === id);
  if (!chunk) throw new Error(`StagingTextChunk not found: ${id}`);
  if (chunk.reviewStatus !== "approved") throw new Error("StagingTextChunk must be approved before promotion.");

  const normalized = chunk.normalizedPayload || {};
  const claimId = arg("claim-id") || chunk.suggestedLinks?.[0]?.entityId;
  const sourceId = arg("source-id") || normalized.sourceId;
  const citation = arg("citation") || normalized.citation;
  const licenseNote = arg("license") || normalized.licenseNote;
  if (!claimId || !sourceId || !citation || !licenseNote) {
    throw new Error("Promotion requires claim-id, source-id, citation and license.");
  }

  const evidence = readJson<EvidenceItem[]>("evidence.json");
  const item: EvidenceItem = {
    id: `ev-promoted-${Date.now()}`,
    claimId,
    sourceId,
    relationToClaim: "提供背景",
    sourceLayer: chunk.detectedSourceLayer,
    sourceType: chunk.detectedSourceType,
    title: normalized.title || "TextChunk 提升证据",
    authorOrInstitution: normalized.authorOrInstitution || "待补",
    dynastyOrDate: normalized.dynastyOrDate || "待补",
    originalText: normalized.originalText || normalized.rawText || "待录入原文",
    translationOrSummary: normalized.translationOrSummary || "",
    url: normalized.url || "",
    archiveUrl: normalized.url || "",
    screenshotOrImageUrl: "",
    locationRef: "由 StagingTextChunk 提升",
    citation,
    licenseNote,
    reliabilityNote: "由审核动作提升，仍需复核。",
    extractionNote: "promoteTextChunkToEvidence",
    reviewerNote: arg("note") || "本地审核动作生成。",
    verificationStatus: "初审",
    auditTrail: [id],
    mediaAssets: [],
    hasImage: false,
    hasVideo: false,
    hasEmbeddableMedia: false,
    demoOnly: false,
    createdAt: now,
    updatedAt: now
  };
  writeJson("evidence.json", [...evidence, item]);
  audit("evidence", item.id, `Promoted from ${id}`, null, item as unknown as Record<string, unknown>);
  console.log(JSON.stringify(item, null, 2));
}

function promoteLeadToClaim() {
  const leads = readJson<any[]>("staging/leads.json");
  const lead = leads.find((item) => item.id === id);
  if (!lead) throw new Error(`StagingLead not found: ${id}`);
  if (lead.reviewStatus !== "approved") throw new Error("StagingLead must be approved before promotion.");

  const claims = readJson<HistoricalClaim[]>("claims.json");
  const normalized = lead.normalizedPayload || {};
  const fallbackClaim = claims[0];
  const claim: HistoricalClaim = {
    id: `claim-promoted-${Date.now()}`,
    title: arg("title") || normalized.title || "由 Lead 提升的待核验主张",
    topic: (arg("topic") || normalized.topic || fallbackClaim?.topic) as HistoricalClaim["topic"],
    period: normalized.period || fallbackClaim?.period || {
      emperor: "待考",
      reignTitle: "待考",
      yearStart: 1368,
      yearEnd: 1644
    },
    qingNarrative: {
      text: normalized.rawSummary || normalized.summary || "由争议线索提升，默认待核验，不能绕过 Evidence 审核。",
      sourceTitle: normalized.platform || "StagingLead",
      volume: "待补",
      originalText: normalized.rawText || normalized.rawSummary || "待补原文",
      url: normalized.url || "",
      note: "Lead 不是事实证据；该主张必须补 Evidence 并完成审核。"
    },
    counterQuestion: normalized.claimQuestion || "该争议说法需要哪些 S/A/B/C 级证据支持或反驳？",
    currentAssessment: (fallbackClaim?.currentAssessment || "") as HistoricalClaim["currentAssessment"],
    evidenceIds: [],
    leadIds: [id],
    sourceIds: [],
    conclusion: "待核验：尚未进入事实结论层。",
    confidenceLevel: "X",
    controversy: normalized.riskLevel === "high" ? 80 : 60,
    reviewStatus: "pending_review",
    reviewNotes: "由 promoteLeadToClaim 生成，需补 Evidence 后才能进入事实结论。",
    tags: ["争议线索", "待核验"],
    demoOnly: Boolean(lead.demoOnly),
    createdAt: now,
    updatedAt: now
  };
  writeJson("claims.json", [...claims, claim]);
  audit("claim", claim.id, `Promoted from staging lead ${id}`, null, claim as unknown as Record<string, unknown>);
  console.log(JSON.stringify(claim, null, 2));
}

function writeLinkAudit(target: AuditRecord["entityType"]) {
  const claimId = requireArg("claim-id");
  const payload = {
    action,
    claimId,
    targetId: id,
    note: arg("note") || "第三阶段本地 JSON link action；正式关系需由页面或后续脚本复核展示。"
  };
  audit(target, id, `${action}: ${id} -> ${claimId}`, null, payload);
  console.log(JSON.stringify(payload, null, 2));
}

if (action === "approve" || action === "reject" || action === "merge") updateStagingStatus();
else if (action === "promoteTextChunkToEvidence") promoteTextChunkToEvidence();
else if (action === "promoteLeadToClaim") promoteLeadToClaim();
else if (action === "linkEvidenceToClaim") writeLinkAudit("evidence");
else if (action === "linkArtifactToClaim") writeLinkAudit("artifact");
else if (action === "linkTerritoryToClaim") writeLinkAudit("territory");
else if (action === "linkPersonToClaim") writeLinkAudit("person");
