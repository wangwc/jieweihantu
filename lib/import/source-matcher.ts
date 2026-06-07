import type { SourceLayer, SourceRegistry } from "@/lib/types";
import { findSourceDuplicates } from "@/lib/import/dedupe";

export function detectSourceLayer(sourceType: string): SourceLayer {
  if (/实录|奏疏|方志|碑刻|墓志|文集/.test(sourceType)) return "S";
  if (/舆图|文物|博物馆|器物|建筑|火器|钱币/.test(sourceType)) return "A";
  if (/海外|朝鲜|日本|琉球|越南|传教士|商人/.test(sourceType)) return "B";
  if (/论文|数据库|考古|研究|CHGIS|CBDB/.test(sourceType)) return "C";
  if (/视频|论坛|知乎|公众号|文章|B站|抖音|YouTube/.test(sourceType)) return "D";
  if (/清修|明史|清代官方/.test(sourceType)) return "Q";
  return "X";
}

export function matchSource(candidate: Partial<SourceRegistry>, sources: SourceRegistry[]) {
  const duplicateCandidateIds = findSourceDuplicates(candidate, sources);
  return {
    duplicateCandidateIds,
    matchedSourceId: duplicateCandidateIds[0] || null
  };
}
