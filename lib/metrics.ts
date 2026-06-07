import type { EvidenceItem, HistoricalClaim, SourceLayer } from "@/lib/types";

export function evidenceCounts(claim: HistoricalClaim, evidence: EvidenceItem[]) {
  const related = evidence.filter((item) => claim.evidenceIds.includes(item.id));
  return {
    total: related.length,
    support: related.filter((item) => item.relationToClaim === "支持清修叙事" || item.relationToClaim === "部分支持").length,
    rebuttal: related.filter((item) => item.relationToClaim === "反驳清修叙事" || item.relationToClaim === "部分反驳").length,
    leads: related.filter((item) => item.relationToClaim === "仅作为线索").length
  };
}

export function layerDistribution(items: { sourceLayer?: SourceLayer; layer?: SourceLayer }[]) {
  return items.reduce<Record<SourceLayer, number>>(
    (acc, item) => {
      const layer = item.sourceLayer ?? item.layer;
      if (layer) acc[layer] += 1;
      return acc;
    },
    { S: 0, A: 0, B: 0, C: 0, D: 0, Q: 0, X: 0 }
  );
}
