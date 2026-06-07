import type { EvidenceItem, HistoricalClaim, LeadItem, RankingMetric, SourceLayer } from "@/lib/types";

const layerWeight: Record<SourceLayer, number> = {
  S: 5,
  A: 4,
  B: 3,
  C: 2,
  D: 0,
  Q: 0,
  X: 0
};

const factLayers: SourceLayer[] = ["S", "A", "B", "C"];

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function isSupport(relation: string) {
  return relation === "支持清修叙事" || relation === "部分支持";
}

function isRefute(relation: string) {
  return relation === "反驳清修叙事" || relation === "部分反驳";
}

export function calculateRankingMetrics(claims: HistoricalClaim[], evidence: EvidenceItem[], leads: LeadItem[], calculatedAt = new Date().toISOString()): RankingMetric[] {
  return claims.map((claim) => {
    const relatedEvidence = evidence.filter((item) => item.claimId === claim.id);
    const relatedLeads = leads.filter((lead) => lead.relatedClaimIds.includes(claim.id) || claim.leadIds.includes(lead.id));
    const factEvidence = relatedEvidence.filter((item) => factLayers.includes(item.sourceLayer));
    const support = relatedEvidence.filter((item) => isSupport(item.relationToClaim));
    const refute = relatedEvidence.filter((item) => isRefute(item.relationToClaim));
    const strongRefute = refute.filter((item) => factLayers.includes(item.sourceLayer));
    const partial = relatedEvidence.filter((item) => item.relationToClaim === "部分支持" || item.relationToClaim === "部分反驳");
    const sourceTypes = new Set(factEvidence.map((item) => item.sourceType));
    const platforms = new Set(relatedLeads.map((lead) => lead.platform));
    const supportWeight = support.reduce((sum, item) => sum + layerWeight[item.sourceLayer], 0);
    const refuteWeight = refute.reduce((sum, item) => sum + layerWeight[item.sourceLayer], 0);
    const balance = supportWeight + refuteWeight === 0 ? 0 : 1 - Math.abs(supportWeight - refuteWeight) / (supportWeight + refuteWeight);
    const completenessParts = factEvidence.reduce((sum, item) => {
      return sum + (item.originalText && item.originalText !== "待录入原文" ? 1 : 0) + (item.citation ? 1 : 0) + (item.licenseNote ? 1 : 0) + (item.verificationStatus === "已确认" || item.verificationStatus === "复审" ? 1 : 0);
    }, 0);

    return {
      claimId: claim.id,
      evidenceCount: relatedEvidence.length,
      supportCount: support.length,
      refuteCount: refute.length,
      partialCount: partial.length,
      leadCount: relatedLeads.length,
      sourceDiversityScore: round(sourceTypes.size * 12 + factEvidence.length * 2),
      controversyScore: round(balance * 70 + Math.min(factEvidence.length * 4, 20) + Math.min(relatedLeads.length * 2, 10)),
      refutationStrengthScore: round(strongRefute.reduce((sum, item) => sum + layerWeight[item.sourceLayer] * 12, 0)),
      evidenceCompletenessScore: round(factEvidence.length === 0 ? 0 : (completenessParts / (factEvidence.length * 4)) * 100),
      leadHeatScore: round(relatedLeads.length * 12 + platforms.size * 8),
      lastCalculatedAt: calculatedAt,
      demoOnly: claim.demoOnly
    };
  });
}

export function rankingExplanation() {
  return {
    controversy: "支持与反驳越接近，且高等级证据越多，平台内部争议度越高。",
    refutation: "只统计 S/A/B/C 级反驳或部分反驳；D/X 只作线索，Q 不计入。",
    completeness: "综合证据数量、来源多样性、原文、引用、授权和审核状态。",
    heat: "线索数量、平台多样性和更新时间形成热度；热度不等于历史可信度。"
  };
}
