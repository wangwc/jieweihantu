import { createCsvAdapter } from "./base";
import type { SeedAdapterContext } from "@/lib/seed/types";

export const chgisAdapter = createCsvAdapter("territory", (context: SeedAdapterContext, rows) => {
  return rows.map((row, index) => ({
    id: row.id || `seed-territory-${index + 1}`,
    importBatchId: context.importBatchId,
    sourceId: `seed-source-${context.source.id}`,
    datasetName: row.datasetName,
    filePathOrUrl: row.filePathOrUrl,
    format: row.format || "GeoJSON",
    title: row.title || row.datasetName || "CHGIS territory candidate",
    controlType: row.controlType || "",
    yearStart: row.yearStart,
    yearEnd: row.yearEnd,
    sourceLayer: row.sourceLayer || context.source.layer,
    citation: row.citationFormat || context.source.citationFormat,
    licenseNote: row.licenseNote || context.source.licenseNote,
    reviewStatus: "pending_review",
    suggestedLinks: [],
    validationWarnings: !row.controlType ? ["controlType 缺失，不能生成正式 Territory。"] : [],
    notes: row.notes || "CHGIS seed 只生成地理数据候选，不生成疆域结论。",
    demoOnly: true,
    createdAt: context.now,
    updatedAt: context.now
  }));
});
