import path from "node:path";
import fs from "node:fs";
import { ensureDir, readInput, readJson, rootDir, writeJson } from "./io";
import type { AuditRecord, ImportBatch, ImportEntityType, ImportStatus, ImportType } from "../../lib/types";

interface ImportOptions<T> {
  inputPath: string;
  targetFile: string;
  entityType: ImportEntityType;
  mapRow: (row: Record<string, unknown>) => T;
  validateRows: (rows: T[]) => { errors: string[]; warnings: string[] };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const inputPath = args.find((arg) => !arg.startsWith("--"));
  return {
    inputPath,
    write: args.includes("--write"),
    importedBy: args.find((arg) => arg.startsWith("--by="))?.slice(5) || "local-import"
  };
}

function importTypeFromPath(inputPath: string): ImportType {
  if (inputPath.endsWith(".csv")) return "csv";
  if (inputPath.endsWith(".json")) return "json";
  return "manual";
}

export function runImport<T extends { id: string }>(options: ImportOptions<T>) {
  const args = parseArgs();
  if (!args.inputPath) {
    throw new Error("请提供输入文件路径，例如：npm run import:sources -- templates/sources.template.csv");
  }

  const rawRows = readInput(args.inputPath) as Record<string, unknown>[];
  const rows = rawRows.map(options.mapRow);
  const result = options.validateRows(rows);
  const now = new Date().toISOString();
  const status: ImportStatus = result.errors.length ? "failed" : result.warnings.length ? "partial_success" : "success";
  const reportsDir = path.join(rootDir, "data", "import-reports");
  ensureDir(reportsDir);
  const reportFile = path.join(reportsDir, `${options.entityType}-${Date.now()}.json`);
  const batch: ImportBatch = {
    id: `batch-${Date.now()}`,
    importType: importTypeFromPath(args.inputPath),
    entityType: options.entityType,
    fileName: path.basename(args.inputPath),
    importedAt: now,
    importedBy: args.importedBy,
    totalRows: rows.length,
    successRows: result.errors.length ? 0 : rows.length,
    failedRows: result.errors.length ? rows.length : 0,
    warnings: result.warnings,
    errors: result.errors,
    status,
    rawFilePath: args.inputPath,
    resultFilePath: path.relative(rootDir, reportFile).replaceAll("\\", "/")
  };
  ensureDir(path.dirname(reportFile));
  fs.writeFileSync(reportFile, `${JSON.stringify({ batch, rows }, null, 2)}\n`, "utf8");

  if (!args.write || result.errors.length) {
    console.log(JSON.stringify({ dryRun: !args.write, batch }, null, 2));
    if (result.errors.length) process.exitCode = 1;
    return;
  }

  const existing = readJson<T[]>(options.targetFile);
  const merged = [...existing];
  const audits = readJson<AuditRecord[]>("audit-records.json");
  for (const row of rows) {
    const index = merged.findIndex((item) => item.id === row.id);
    const before = index >= 0 ? merged[index] : null;
    if (index >= 0) merged[index] = row;
    else merged.push(row);
    audits.push({
      id: `audit-${Date.now()}-${row.id}`,
      entityType: options.entityType,
      entityId: row.id,
      action: before ? "update" : "create",
      before: before as Record<string, unknown> | null,
      after: row as Record<string, unknown>,
      note: "本地导入脚本生成的审核记录。",
      reviewer: args.importedBy,
      createdAt: now
    });
  }

  const batches = readJson<ImportBatch[]>("import-batches.json");
  batches.push(batch);
  writeJson(options.targetFile, merged);
  writeJson("audit-records.json", audits);
  writeJson("import-batches.json", batches);
  console.log(JSON.stringify({ dryRun: false, batch }, null, 2));
}
