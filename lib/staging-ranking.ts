import type { AlternativeNarrativeRanking, ControversialClaim, EvidenceGapTask, StagingBase } from "@/lib/types";

export interface StagingRankingMetric {
  id: string;
  title: string;
  backlogScore: number;
  highRiskScore: number;
  evidenceGapScore: number;
  highValueTaskScore: number;
  lastCalculatedAt: string;
}

export function calculateStagingBacklogRankings(items: StagingBase[], controversialClaims: ControversialClaim[], tasks: EvidenceGapTask[], alternativeRankings: AlternativeNarrativeRanking[]): StagingRankingMetric[] {
  const now = new Date().toISOString();
  const stagingRows = items.map((item) => ({
    id: item.id,
    title: `${item.detectedSourceType} · ${item.id}`,
    backlogScore: item.reviewStatus === "pending_review" ? 50 + item.validationWarnings.length * 5 + item.validationErrors.length * 15 : 0,
    highRiskScore: ["D", "Q", "X"].includes(item.detectedSourceLayer) ? 60 + item.validationErrors.length * 10 : 10,
    evidenceGapScore: item.suggestedLinks.length ? 30 : 45,
    highValueTaskScore: item.confidence * 40 + item.suggestedLinks.length * 8,
    lastCalculatedAt: now
  }));
  const controversialRows = controversialClaims.map((claim) => {
    const ranking = alternativeRankings.find((item) => item.controversialClaimId === claim.id);
    const relatedTasks = tasks.filter((task) => task.controversialClaimId === claim.id);
    return {
      id: claim.id,
      title: claim.title,
      backlogScore: claim.status === "待核验" ? 55 : 0,
      highRiskScore: claim.riskLevel === "high" ? 80 : claim.riskLevel === "medium" ? 55 : 25,
      evidenceGapScore: ranking?.evidenceGapScore ?? relatedTasks.length * 18,
      highValueTaskScore: relatedTasks.filter((task) => task.priority === "high").length * 35 + relatedTasks.length * 12,
      lastCalculatedAt: now
    };
  });
  return [...stagingRows, ...controversialRows];
}
