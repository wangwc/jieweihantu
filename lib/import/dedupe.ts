import type { Artifact, HistoricalClaim, PersonProfile, SourceRegistry, TextChunk } from "@/lib/types";

export function simpleHash(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function normalizeText(input = "") {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function similarity(a: string, b: string) {
  const left = new Set(normalizeText(a).split(""));
  const right = new Set(normalizeText(b).split(""));
  if (!left.size || !right.size) return 0;
  const overlap = Array.from(left).filter((item) => right.has(item)).length;
  return overlap / Math.max(left.size, right.size);
}

export function findSourceDuplicates(candidate: Partial<SourceRegistry>, sources: SourceRegistry[]) {
  return sources
    .filter((source) => {
      return Boolean(
        (candidate.url && source.url === candidate.url) ||
          (candidate.title && similarity(candidate.title, source.title) > 0.86) ||
          (candidate.citationFormat && source.citationFormat === candidate.citationFormat)
      );
    })
    .map((source) => source.id);
}

export function findClaimDuplicates(title: string, claims: HistoricalClaim[]) {
  return claims.filter((claim) => similarity(title, claim.title) > 0.72).map((claim) => claim.id);
}

export function findTextChunkDuplicates(originalText: string, chunks: TextChunk[]) {
  const hash = simpleHash(originalText);
  return chunks.filter((chunk) => simpleHash(chunk.originalText) === hash).map((chunk) => chunk.id);
}

export function findArtifactDuplicates(candidate: Partial<Artifact>, artifacts: Artifact[]) {
  return artifacts
    .filter((artifact) => candidate.title === artifact.title && candidate.institution === artifact.institution)
    .map((artifact) => artifact.id);
}

export function findPersonDuplicates(candidate: Partial<PersonProfile>, persons: PersonProfile[]) {
  return persons
    .filter((person) => {
      return candidate.name === person.name && (candidate.reignYears === person.reignYears || candidate.nativePlace === person.nativePlace);
    })
    .map((person) => person.id);
}
