import { runImport } from "./lib/importer";
import type { SourceLayer, SourceRegistry } from "../lib/types";

const now = () => new Date().toISOString();
const layers = ["S", "A", "B", "C", "D", "Q", "X"];

runImport<SourceRegistry>({
  inputPath: "",
  targetFile: "sources.json",
  entityType: "source",
  mapRow: (row) => ({
    id: String(row.id || ""),
    title: String(row.title || ""),
    sourceType: String(row.sourceType || ""),
    sourceLayer: String(row.sourceLayer || "X") as SourceLayer,
    institution: String(row.institution || ""),
    author: String(row.author || ""),
    dynastyOrDate: String(row.dynastyOrDate || ""),
    url: String(row.url || ""),
    homepageUrl: String(row.homepageUrl || row.url || ""),
    previewImageUrl: String(row.previewImageUrl || ""),
    accessMethod: String(row.accessMethod || "manual"),
    licenseNote: String(row.licenseNote || ""),
    citationFormat: String(row.citationFormat || ""),
    reliabilityNote: String(row.reliabilityNote || ""),
    allowedUsage: String(row.allowedUsage || ""),
    importMethod: String(row.importMethod || "manual") as SourceRegistry["importMethod"],
    reviewRequired: String(row.reviewRequired || "true") !== "false",
    status: String(row.status || "pending") as SourceRegistry["status"],
    sampleMediaAssets: [],
    demoOnly: String(row.demoOnly || "true") !== "false",
    createdAt: String(row.createdAt || now()),
    updatedAt: String(row.updatedAt || now())
  }),
  validateRows: (rows) => ({
    errors: rows.flatMap((row) => [
      !row.id ? "来源缺少 id" : "",
      !row.title ? `来源 ${row.id} 缺少 title` : "",
      !layers.includes(row.sourceLayer) ? `来源 ${row.id} sourceLayer 非法` : "",
      !row.licenseNote ? `来源 ${row.id} 缺少 licenseNote` : ""
    ].filter(Boolean)),
    warnings: rows.flatMap((row) => (!row.citationFormat ? [`来源 ${row.id} 缺少 citationFormat`] : []))
  })
});
