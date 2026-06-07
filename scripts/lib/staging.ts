import type { ImportBatch, ImportRowError, StagingBase } from "../../lib/types";
import { readJson, writeJson } from "./io";

export function createBatch(entityType: ImportBatch["entityType"], fileName: string, totalRows: number, warnings: string[] = [], errors: string[] = []): ImportBatch {
  return {
    id: `batch-staging-${Date.now()}`,
    importType: fileName.endsWith(".csv") ? "csv" : fileName.endsWith(".json") ? "json" : "manual",
    entityType,
    fileName,
    importedAt: new Date().toISOString(),
    importedBy: "staging-importer",
    totalRows,
    successRows: errors.length ? 0 : totalRows,
    failedRows: errors.length ? totalRows : 0,
    warnings,
    errors,
    status: errors.length ? "failed" : warnings.length ? "partial_success" : "success",
    rawFilePath: fileName,
    resultFilePath: "data/staging"
  };
}

export function writeStaging<T extends StagingBase>(fileName: string, rows: T[], batch: ImportBatch, rowErrors: ImportRowError[], write: boolean) {
  if (!write) {
    console.log(JSON.stringify({ dryRun: true, batch, rows, rowErrors }, null, 2));
    return;
  }
  const existing = readJson<T[]>(`staging/${fileName}`);
  const batches = readJson<ImportBatch[]>("import-batches.json");
  const errors = readJson<ImportRowError[]>("import-row-errors.json");
  writeJson(`staging/${fileName}`, [...existing, ...rows]);
  writeJson("import-batches.json", [...batches, batch]);
  writeJson("import-row-errors.json", [...errors, ...rowErrors]);
  console.log(JSON.stringify({ dryRun: false, batch, count: rows.length }, null, 2));
}
