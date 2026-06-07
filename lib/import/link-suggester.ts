import type { HistoricalClaim, SuggestedLink } from "@/lib/types";
import { extractEntities } from "@/lib/import/entity-extractor";
import { similarity } from "@/lib/import/dedupe";

export function suggestClaimLinks(text: string, claims: HistoricalClaim[]): SuggestedLink[] {
  const entities = extractEntities(text);
  return claims
    .map((claim) => {
      const haystack = `${claim.title} ${claim.counterQuestion} ${claim.tags.join(" ")} ${claim.period.emperor} ${claim.period.reignTitle}`;
      const keywordHits = entities.keywords.filter((keyword) => haystack.includes(keyword)).length;
      const confidence = Math.min(0.95, similarity(text, haystack) * 0.6 + keywordHits * 0.08);
      return {
        entityType: "claim" as const,
        entityId: claim.id,
        label: claim.title,
        reason: keywordHits ? `命中 ${keywordHits} 个关键词或实体。` : "标题相似度建议。",
        confidence
      };
    })
    .filter((link) => link.confidence >= 0.28)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}
