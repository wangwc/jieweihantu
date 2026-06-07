import claimsData from "@/data/claims.json";
import emperorsData from "@/data/emperors.json";
import evidenceData from "@/data/evidence.json";
import leadsData from "@/data/leads.json";
import auditRecordsData from "@/data/audit-records.json";
import importBatchesData from "@/data/import-batches.json";
import rankingsData from "@/data/rankings.json";
import sourcesData from "@/data/sources.json";
import territoryData from "@/data/territory-layers.json";
import type { AuditRecord, EmperorProfile, EvidenceItem, HistoricalClaim, ImportBatch, LeadItem, RankingMetric, Source, SourceRegistry, TerritoryLayer } from "@/lib/types";

export const claims = claimsData as HistoricalClaim[];
export const evidence = evidenceData as EvidenceItem[];
export const emperors = emperorsData as EmperorProfile[];
export const leads = leadsData as LeadItem[];
export const sourceRegistry = sourcesData as SourceRegistry[];
export const sources = sourceRegistry.map((source) => ({
  ...source,
  layer: source.sourceLayer,
  date: source.dynastyOrDate
})) as Source[];
export const territoryLayers = territoryData as TerritoryLayer[];
export const importBatches = importBatchesData as ImportBatch[];
export const auditRecords = auditRecordsData as AuditRecord[];
export const rankings = rankingsData as RankingMetric[];

export function getClaim(id: string) {
  return claims.find((claim) => claim.id === id);
}

export function getEvidenceForClaim(claimId: string) {
  return evidence.filter((item) => item.claimId === claimId);
}

export function getEmperor(id: string) {
  return emperors.find((emperor) => emperor.id === id);
}

export function getClaimsForEmperor(emperorName: string) {
  return claims.filter((claim) => claim.period.emperor === emperorName);
}

export function getSource(id: string) {
  return sourceRegistry.find((source) => source.id === id);
}

export function getLeadsForClaim(claimId: string) {
  return leads.filter((lead) => lead.relatedClaimIds.includes(claimId));
}
