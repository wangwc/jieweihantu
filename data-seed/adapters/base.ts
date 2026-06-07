import path from "node:path";
import type { ImportBatch } from "@/lib/types";
import type { SeedAdapter, SeedAdapterContext, SeedAdapterResult, SeedReportIssue } from "@/lib/seed/types";
import { readSeedCsv, seedPath, writeJsonFile } from "@/lib/seed/fs";

export function makeBatch(context: SeedAdapterContext, entityType: ImportBatch["entityType"], totalRows: number): ImportBatch {
  return {
    id: context.importBatchId,
    importType: "csv",
    entityType,
    fileName: context.source.input,
    importedAt: context.now,
    importedBy: "seed-builder",
    totalRows,
    successRows: totalRows,
    failedRows: 0,
    warnings: [],
    errors: [],
    status: "success",
    rawFilePath: context.source.input,
    resultFilePath: context.source.output,
    demoOnly: true
  };
}

export function missingIssue(context: SeedAdapterContext, filePath = context.source.input): SeedReportIssue {
  return {
    id: `missing-${context.source.id}`,
    sourceId: context.source.id,
    filePath,
    severity: "warning",
    message: "Raw source is not available. Seed builder records this as missing data instead of fabricating records."
  };
}

export function sourceRegistryRecord(context: SeedAdapterContext) {
  return {
    id: `seed-source-${context.source.id}`,
    title: context.source.name,
    sourceType: context.source.type,
    sourceLayer: context.source.layer,
    institution: context.source.name,
    author: "",
    dynastyOrDate: "seed",
    url: context.source.input.startsWith("http") ? context.source.input : "",
    accessMethod: context.source.adapter,
    licenseNote: context.source.licenseNote,
    citation: context.source.citationFormat,
    citationFormat: context.source.citationFormat,
    reliabilityNote: context.source.notes,
    allowedUsage: context.source.allowedUsage,
    importMethod: context.source.type === "open_data" ? "open-data" : "csv",
    reviewRequired: context.source.requiresManualReview,
    status: context.source.enabled ? "pending" : "disabled",
    sampleMediaAssets: [],
    demoOnly: true,
    createdAt: context.now,
    updatedAt: context.now
  };
}

export function createCsvAdapter(entityType: ImportBatch["entityType"], normalizeRows: (context: SeedAdapterContext, rows: Record<string, string>[]) => Record<string, unknown>[]): SeedAdapter {
  return {
    async fetch(context) {
      const rows = readSeedCsv(context.source.input);
      const warnings = rows.length ? [] : [missingIssue(context, path.join("data-seed", context.source.input))];
      return { sourceRecords: [sourceRegistryRecord(context)], normalizedRecords: rows, warnings, errors: [] };
    },
    async normalize(context) {
      const rows = readSeedCsv(context.source.input);
      const warnings = rows.length ? [] : [missingIssue(context, path.join("data-seed", context.source.input))];
      return { sourceRecords: [sourceRegistryRecord(context)], normalizedRecords: normalizeRows(context, rows), warnings, errors: [] };
    },
    validate(context, records) {
      return records.length ? [] : [missingIssue(context)];
    },
    getSourceRegistryRecords(context) {
      return [sourceRegistryRecord(context)];
    },
    getImportBatch(context, totalRows) {
      return makeBatch(context, entityType, totalRows);
    },
    async writeReports(context, result: SeedAdapterResult) {
      writeJsonFile(seedPath("reports", `${context.source.id}-adapter-report.json`), result);
    }
  };
}
