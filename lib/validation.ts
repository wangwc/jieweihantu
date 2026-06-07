import type { Artifact, AuditRecord, ControversialClaim, EvidenceGapTask, EvidenceItem, HistoricalClaim, LeadItem, PersonProfile, SourceLayer, SourceRegistry, StagingBase, StagingReviewStatus, TerritoryLayer, TextChunk, VerificationStatus, ReviewStatus } from "@/lib/types";

const layers: SourceLayer[] = ["S", "A", "B", "C", "D", "Q", "X"];
const verificationStatuses: VerificationStatus[] = ["未审核", "初审", "复审", "已确认", "已废弃"];
const reviewStatuses: ReviewStatus[] = ["draft", "pending_review", "reviewed", "disputed", "archived"];
const stagingReviewStatuses: StagingReviewStatus[] = ["pending_review", "approved", "rejected", "merged"];
const relations = ["支持清修叙事", "反驳清修叙事", "部分支持", "部分反驳", "提供背景", "仅作为线索"];

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

function hasValidUrl(value?: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateDataset({
  claims,
  evidence,
  sources,
  leads,
  controversialClaims = [],
  evidenceTasks = [],
  stagingItems = [],
  textChunks = [],
  artifacts = [],
  territoryLayers = [],
  auditRecords = []
}: {
  claims: HistoricalClaim[];
  evidence: EvidenceItem[];
  sources: SourceRegistry[];
  leads: LeadItem[];
  controversialClaims?: ControversialClaim[];
  evidenceTasks?: EvidenceGapTask[];
  stagingItems?: StagingBase[];
  textChunks?: TextChunk[];
  artifacts?: Artifact[];
  persons?: PersonProfile[];
  territoryLayers?: TerritoryLayer[];
  auditRecords?: AuditRecord[];
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const claimIds = new Set(claims.map((claim) => claim.id));
  const evidenceIds = new Set(evidence.map((item) => item.id));
  const sourceIds = new Set(sources.map((source) => source.id));
  const leadIds = new Set(leads.map((lead) => lead.id));
  const controversialClaimIds = new Set(controversialClaims.map((claim) => claim.id));
  const taskIds = new Set(evidenceTasks.map((task) => task.id));
  const auditEntityIds = new Set(auditRecords.map((record) => record.entityId));

  for (const source of sources) {
    if (!layers.includes(source.sourceLayer)) errors.push(`Source ${source.id} sourceLayer 非法：${source.sourceLayer}`);
    if (!source.licenseNote) errors.push(`Source ${source.id} 缺少 licenseNote`);
    if (!source.citationFormat) warnings.push(`Source ${source.id} 缺少 citationFormat`);
    if (!hasValidUrl(source.url) || !hasValidUrl(source.homepageUrl)) errors.push(`Source ${source.id} URL 格式不合法`);
    if (source.demoOnly && !source.title.includes("占位") && !source.reliabilityNote.includes("示例")) warnings.push(`Source ${source.id} 是 demo 数据，但标记不够明显`);
  }

  for (const claim of claims) {
    if (!reviewStatuses.includes(claim.reviewStatus)) errors.push(`Claim ${claim.id} reviewStatus 非法：${claim.reviewStatus}`);
    for (const evidenceId of claim.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) errors.push(`Claim ${claim.id} 引用不存在的 Evidence：${evidenceId}`);
    }
    for (const leadId of claim.leadIds || []) {
      if (!leadIds.has(leadId)) errors.push(`Claim ${claim.id} 引用不存在的 Lead：${leadId}`);
    }
    for (const sourceId of claim.sourceIds || []) {
      if (!sourceIds.has(sourceId)) errors.push(`Claim ${claim.id} 引用不存在的 Source：${sourceId}`);
    }
    if (claim.demoOnly && !claim.reviewNotes.includes("示例")) warnings.push(`Claim ${claim.id} 是 demo 数据，但 reviewNotes 未明确示例性质`);
  }

  for (const item of evidence) {
    if (!claimIds.has(item.claimId)) errors.push(`Evidence ${item.id} claimId 不存在：${item.claimId}`);
    if (!sourceIds.has(item.sourceId)) errors.push(`Evidence ${item.id} sourceId 不存在：${item.sourceId}`);
    if (!layers.includes(item.sourceLayer)) errors.push(`Evidence ${item.id} sourceLayer 非法：${item.sourceLayer}`);
    if (!relations.includes(item.relationToClaim)) errors.push(`Evidence ${item.id} relationToClaim 非法：${item.relationToClaim}`);
    if (!verificationStatuses.includes(item.verificationStatus)) errors.push(`Evidence ${item.id} verificationStatus 非法：${item.verificationStatus}`);
    if ((item.sourceLayer === "D" || item.sourceLayer === "X") && item.relationToClaim !== "仅作为线索") {
      errors.push(`Evidence ${item.id} 为 ${item.sourceLayer} 级，只能标为“仅作为线索”`);
    }
    if (item.sourceLayer === "Q" && (item.relationToClaim === "反驳清修叙事" || item.relationToClaim === "部分反驳")) {
      errors.push(`Evidence ${item.id} 为 Q 级，不得作为事实反证`);
    }
    if (!item.licenseNote) errors.push(`Evidence ${item.id} 缺少 licenseNote`);
    if (!item.citation && !item.url) errors.push(`Evidence ${item.id} 缺少 citation 或 url`);
    if (!hasValidUrl(item.url) || !hasValidUrl(item.archiveUrl)) errors.push(`Evidence ${item.id} URL 或 archiveUrl 格式不合法`);
    if (item.demoOnly && !item.reviewerNote.includes("示例") && !item.citation.includes("示例")) warnings.push(`Evidence ${item.id} 是 demo 数据，但标记不够明显`);
  }

  for (const lead of leads) {
    for (const claimId of lead.relatedClaimIds) {
      if (!claimIds.has(claimId)) errors.push(`Lead ${lead.id} 引用不存在的 Claim：${claimId}`);
    }
    if (!hasValidUrl(lead.url) || !hasValidUrl(lead.embedUrl)) errors.push(`Lead ${lead.id} URL 或 embedUrl 格式不合法`);
  }

  for (const claim of controversialClaims) {
    if (claim.status !== "待核验" && claim.status !== "待补证据" && claim.status !== "待审核" && claim.status !== "已转入证据流程" && claim.status !== "已驳回" && claim.status !== "暂存") {
      errors.push(`ControversialClaim ${claim.id} 状态非法：${claim.status}`);
    }
    if (claim.status !== "待核验" && claim.demoOnly) {
      warnings.push(`ControversialClaim ${claim.id} 是示例争议主张，建议默认保持“待核验”`);
    }
    if (!claim.sourceLeadId) errors.push(`ControversialClaim ${claim.id} 缺少 sourceLeadId`);
    for (const sourceId of claim.speculativeSourceIds) {
      const source = sources.find((item) => item.id === sourceId);
      if (!source) errors.push(`ControversialClaim ${claim.id} 引用不存在的 speculative source：${sourceId}`);
      if (source && source.sourceType !== "Speculative Source") warnings.push(`ControversialClaim ${claim.id} 的来源 ${sourceId} 不是 Speculative Source 类型`);
    }
    for (const taskId of claim.requiredEvidenceTasks) {
      if (!taskIds.has(taskId)) errors.push(`ControversialClaim ${claim.id} 引用不存在的 EvidenceGapTask：${taskId}`);
    }
  }

  for (const task of evidenceTasks) {
    if (!controversialClaimIds.has(task.controversialClaimId)) errors.push(`EvidenceGapTask ${task.id} 引用不存在的 ControversialClaim：${task.controversialClaimId}`);
    if (task.status === "已补充" && task.demoOnly) warnings.push(`EvidenceGapTask ${task.id} 是 demo 任务，不应默认标为已补充`);
  }

  for (const item of stagingItems) {
    if (!stagingReviewStatuses.includes(item.reviewStatus)) errors.push(`Staging ${item.id} reviewStatus 非法：${item.reviewStatus}`);
    if (item.reviewStatus === "pending_review" && Object.values(item.normalizedPayload || {}).some((value) => typeof value === "string" && value.includes("已确认"))) {
      errors.push(`Staging ${item.id} 不能包含正式结论状态`);
    }
  }

  for (const chunk of textChunks) {
    if (!sourceIds.has(chunk.sourceId)) errors.push(`TextChunk ${chunk.id} sourceId 不存在：${chunk.sourceId}`);
    if (chunk.reviewStatus === "approved" && !auditEntityIds.has(chunk.id)) warnings.push(`TextChunk ${chunk.id} 已审核但缺少 AuditRecord`);
    if (!chunk.licenseNote) errors.push(`TextChunk ${chunk.id} 缺少 licenseNote`);
  }

  for (const artifact of artifacts) {
    if (!artifact.licenseNote) errors.push(`Artifact ${artifact.id} 缺少 licenseNote`);
    if (artifact.reviewStatus === "approved" && !auditEntityIds.has(artifact.id)) warnings.push(`Artifact ${artifact.id} 已审核但缺少 AuditRecord`);
  }

  for (const territory of territoryLayers) {
    if (!territory.controlType) errors.push(`Territory ${territory.id} 缺少 controlType`);
  }

  return { ok: errors.length === 0, errors, warnings };
}
