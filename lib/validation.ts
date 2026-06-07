import type { EvidenceItem, HistoricalClaim, LeadItem, SourceLayer, SourceRegistry, VerificationStatus, ReviewStatus } from "@/lib/types";

const layers: SourceLayer[] = ["S", "A", "B", "C", "D", "Q", "X"];
const verificationStatuses: VerificationStatus[] = ["未审核", "初审", "复审", "已确认", "已废弃"];
const reviewStatuses: ReviewStatus[] = ["draft", "pending_review", "reviewed", "disputed", "archived"];
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
  leads
}: {
  claims: HistoricalClaim[];
  evidence: EvidenceItem[];
  sources: SourceRegistry[];
  leads: LeadItem[];
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const claimIds = new Set(claims.map((claim) => claim.id));
  const evidenceIds = new Set(evidence.map((item) => item.id));
  const sourceIds = new Set(sources.map((source) => source.id));
  const leadIds = new Set(leads.map((lead) => lead.id));

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
    if (!item.citation) warnings.push(`Evidence ${item.id} 缺少 citation`);
    if (!hasValidUrl(item.url) || !hasValidUrl(item.archiveUrl)) errors.push(`Evidence ${item.id} URL 或 archiveUrl 格式不合法`);
    if (item.demoOnly && !item.reviewerNote.includes("示例") && !item.citation.includes("示例")) warnings.push(`Evidence ${item.id} 是 demo 数据，但标记不够明显`);
  }

  for (const lead of leads) {
    for (const claimId of lead.relatedClaimIds) {
      if (!claimIds.has(claimId)) errors.push(`Lead ${lead.id} 引用不存在的 Claim：${claimId}`);
    }
    if (!hasValidUrl(lead.url) || !hasValidUrl(lead.embedUrl)) errors.push(`Lead ${lead.id} URL 或 embedUrl 格式不合法`);
  }

  return { ok: errors.length === 0, errors, warnings };
}
