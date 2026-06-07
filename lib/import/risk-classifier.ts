import type { RiskLevel, SourceLayer } from "@/lib/types";

export function classifyRisk(text: string, layer: SourceLayer): { riskLevel: RiskLevel; warnings: string[] } {
  const warnings: string[] = [];
  if (layer === "D" || layer === "X") warnings.push("D/X 级资料只能生成 Lead 或争议主张候选。");
  if (layer === "Q") warnings.push("Q 级清修叙事只能作为待核验对象。");
  if (/震惊|真相|彻底|完全|唯一|无敌|必然/.test(text)) warnings.push("检测到高风险绝对化或营销化表达。");
  const riskLevel: RiskLevel = warnings.length >= 2 || layer === "X" ? "high" : warnings.length === 1 || layer === "D" || layer === "Q" ? "medium" : "low";
  return { riskLevel, warnings };
}
