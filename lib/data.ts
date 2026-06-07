import claimsData from "@/data/claims.json";
import emperorsData from "@/data/emperors.json";
import evidenceData from "@/data/evidence.json";
import leadsData from "@/data/leads.json";
import auditRecordsData from "@/data/audit-records.json";
import alternativeRankingsData from "@/data/alternative-rankings.json";
import artifactsData from "@/data/artifacts.json";
import controversialClaimsData from "@/data/controversial-claims.json";
import evidenceTasksData from "@/data/evidence-tasks.json";
import importRowErrorsData from "@/data/import-row-errors.json";
import importBatchesData from "@/data/import-batches.json";
import personsData from "@/data/persons.json";
import rankingsData from "@/data/rankings.json";
import sourcesData from "@/data/sources.json";
import stagingArtifactsData from "@/data/staging/artifacts.json";
import stagingClaimsData from "@/data/staging/claims.json";
import stagingEvidenceData from "@/data/staging/evidence.json";
import stagingLeadsData from "@/data/staging/leads.json";
import stagingPersonsData from "@/data/staging/persons.json";
import stagingSourcesData from "@/data/staging/sources.json";
import stagingTerritoryData from "@/data/staging/territory.json";
import stagingTextChunksData from "@/data/staging/text-chunks.json";
import textChunksData from "@/data/text-chunks.json";
import territoryData from "@/data/territory-layers.json";
import type { AlternativeNarrativeRanking, Artifact, AuditRecord, ControversialClaim, EmperorProfile, EvidenceGapTask, EvidenceItem, HistoricalClaim, ImportBatch, ImportRowError, LeadItem, PersonProfile, RankingMetric, Source, SourceRegistry, StagingArtifact, StagingClaim, StagingEvidence, StagingLead, StagingPerson, StagingSource, StagingTerritory, StagingTextChunk, TextChunk, TerritoryLayer } from "@/lib/types";

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
export const controversialClaims = controversialClaimsData as ControversialClaim[];
export const evidenceTasks = evidenceTasksData as EvidenceGapTask[];
export const alternativeRankings = alternativeRankingsData as AlternativeNarrativeRanking[];
export const textChunks = textChunksData as TextChunk[];
export const artifacts = artifactsData as Artifact[];
export const persons = personsData as PersonProfile[];
export const importRowErrors = importRowErrorsData as ImportRowError[];
export const stagingSources = stagingSourcesData as StagingSource[];
export const stagingLeads = stagingLeadsData as StagingLead[];
export const stagingClaims = stagingClaimsData as StagingClaim[];
export const stagingEvidence = stagingEvidenceData as StagingEvidence[];
export const stagingTextChunks = stagingTextChunksData as StagingTextChunk[];
export const stagingArtifacts = stagingArtifactsData as StagingArtifact[];
export const stagingTerritory = stagingTerritoryData as StagingTerritory[];
export const stagingPersons = stagingPersonsData as StagingPerson[];
export const stagingItems = [
  ...stagingSources,
  ...stagingLeads,
  ...stagingClaims,
  ...stagingEvidence,
  ...stagingTextChunks,
  ...stagingArtifacts,
  ...stagingTerritory,
  ...stagingPersons
];

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

export function getControversialClaim(id: string) {
  return controversialClaims.find((claim) => claim.id === id);
}

export function getEvidenceTasksForControversialClaim(claimId: string) {
  return evidenceTasks.filter((task) => task.controversialClaimId === claimId);
}
