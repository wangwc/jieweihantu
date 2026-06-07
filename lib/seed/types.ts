import type { ImportBatch, SourceLayer, StagingReviewStatus } from "@/lib/types";

export type SeedSourceType = "open_data" | "historical_text" | "museum" | "controversial_claims" | "local_file";
export type SeedAdapterName = "chgis" | "cbdb" | "museum" | "mediawiki-text" | "controversial-url-list" | "local-file";

export interface SeedSourceConfig {
  id: string;
  name: string;
  enabled: boolean;
  type: SeedSourceType;
  layer: SourceLayer;
  adapter: SeedAdapterName;
  input: string;
  output: string;
  licenseNote: string;
  citationFormat: string;
  allowedUsage: string;
  rateLimit: string;
  requiresManualReview: boolean;
  notes: string;
}

export interface SeedPolicy {
  defaultReviewStatus: StagingReviewStatus;
  defaultControversialLayer: "D/X";
  allowNetworkByDefault: boolean;
  requireImportBatchId: boolean;
  requireLicenseNote: boolean;
  requireCitationOrUrl: boolean;
  textChunkIsEvidence: false;
}

export interface SeedReportIssue {
  id: string;
  sourceId?: string;
  filePath?: string;
  severity: "info" | "warning" | "error";
  message: string;
}

export interface SeedAdapterContext {
  source: SeedSourceConfig;
  allowNetwork: boolean;
  importBatchId: string;
  now: string;
}

export interface SeedAdapterResult {
  sourceRecords: Record<string, unknown>[];
  normalizedRecords: Record<string, unknown>[];
  warnings: SeedReportIssue[];
  errors: SeedReportIssue[];
}

export interface SeedAdapter {
  fetch(context: SeedAdapterContext): Promise<SeedAdapterResult>;
  normalize(context: SeedAdapterContext): Promise<SeedAdapterResult>;
  validate(context: SeedAdapterContext, records: Record<string, unknown>[]): SeedReportIssue[];
  getSourceRegistryRecords(context: SeedAdapterContext): Record<string, unknown>[];
  getImportBatch(context: SeedAdapterContext, totalRows: number): ImportBatch;
  writeReports(context: SeedAdapterContext, result: SeedAdapterResult): Promise<void>;
}

export interface SeedBuildReport {
  id: string;
  generatedAt: string;
  allowNetwork: boolean;
  sources: Array<{ id: string; name: string; enabled: boolean; adapter: string; status: string }>;
  warnings: SeedReportIssue[];
  errors: SeedReportIssue[];
}
