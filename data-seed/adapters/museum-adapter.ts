import { createCsvAdapter } from "./base";
import type { SeedAdapterContext } from "@/lib/seed/types";

export const museumAdapter = createCsvAdapter("artifact", (context: SeedAdapterContext, rows) => {
  return rows.map((row, index) => ({
    id: row.id || `seed-artifact-${index + 1}`,
    importBatchId: context.importBatchId,
    sourceId: `seed-source-${context.source.id}`,
    datasetName: row.datasetName,
    filePathOrUrl: row.filePathOrUrl,
    format: row.format || "CSV",
    title: row.title || row.datasetName || "Museum artifact candidate",
    artifactType: row.artifactType || "",
    institution: row.institution || row.datasetName || "",
    collectionUrl: row.collectionUrl || row.filePathOrUrl || "",
    sourceLayer: row.sourceLayer || context.source.layer,
    citation: row.citationFormat || context.source.citationFormat,
    licenseNote: row.licenseNote || context.source.licenseNote,
    reviewStatus: "pending_review",
    suggestedLinks: [],
    validationWarnings: !row.licenseNote && !context.source.licenseNote ? ["licenseNote 缺失。"] : [],
    notes: row.notes || "Museum seed 保留授权和馆藏入口，不下载受限大图。",
    demoOnly: true,
    createdAt: context.now,
    updatedAt: context.now
  }));
});
