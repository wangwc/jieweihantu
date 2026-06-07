import { createCsvAdapter } from "./base";
import type { SeedAdapterContext } from "@/lib/seed/types";

export const cbdbAdapter = createCsvAdapter("person", (context: SeedAdapterContext, rows) => {
  return rows.map((row, index) => ({
    id: row.id || `seed-person-${index + 1}`,
    importBatchId: context.importBatchId,
    sourceId: `seed-source-${context.source.id}`,
    datasetName: row.datasetName,
    filePathOrUrl: row.filePathOrUrl,
    format: row.format || "CSV",
    name: row.name || "",
    office: row.office || "",
    nativePlace: row.nativePlace || "",
    dynastyOrDate: row.dynastyOrDate || "明代",
    sourceLayer: row.sourceLayer || context.source.layer,
    citation: row.citationFormat || context.source.citationFormat,
    licenseNote: row.licenseNote || context.source.licenseNote,
    reviewStatus: "pending_review",
    suggestedLinks: [],
    notes: row.notes || "CBDB seed 只生成结构化人物候选，不生成评价结论。",
    demoOnly: true,
    createdAt: context.now,
    updatedAt: context.now
  }));
});
