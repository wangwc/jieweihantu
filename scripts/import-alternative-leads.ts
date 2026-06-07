import fs from "node:fs";
import path from "node:path";
import { controversialClaims, evidenceTasks } from "../lib/data";
import { decomposeAlternativeNarrative } from "../lib/alternative-narrative";
import type { AlternativeLeadKind, ImportBatch } from "../lib/types";
import { readJson, writeJson } from "./lib/io";

function arg(name: string) {
  const prefix = `--${name}=`;
  return process.argv.find((item) => item.startsWith(prefix))?.slice(prefix.length);
}

const sourceKind = (arg("kind") || "article") as AlternativeLeadKind;
const inputPath = arg("file");
const url = arg("url") || "https://example.org/alternative-lead";
const platform = (arg("platform") || "其他") as any;
const leadId = arg("lead-id") || `alternative-${Date.now()}`;
const write = process.argv.includes("--write");

if (!inputPath) {
  throw new Error("请提供 --file=路径，支持 URL摘要、文章正文或字幕文本。");
}

const text = fs.readFileSync(path.resolve(process.cwd(), inputPath), "utf8");
const result = decomposeAlternativeNarrative({ leadId, sourceUrl: url, sourceKind, platform, text });
const batch: ImportBatch = {
  id: `batch-alt-${Date.now()}`,
  importType: "manual",
  entityType: "controversial-claim",
  fileName: path.basename(inputPath),
  importedAt: new Date().toISOString(),
  importedBy: "alternative-lead-importer",
  totalRows: result.claims.length,
  successRows: result.claims.length,
  failedRows: 0,
  warnings: ["争议主张默认待核验；未写入事实 Evidence。"],
  errors: [],
  status: "success",
  rawFilePath: inputPath,
  resultFilePath: "data/controversial-claims.json"
};

if (write) {
  const batches = readJson<ImportBatch[]>("import-batches.json");
  writeJson("controversial-claims.json", [...controversialClaims, ...result.claims]);
  writeJson("evidence-tasks.json", [...evidenceTasks, ...result.tasks]);
  writeJson("import-batches.json", [...batches, batch]);
}

console.log(JSON.stringify({ dryRun: !write, batch, generatedClaims: result.claims, generatedTasks: result.tasks }, null, 2));
