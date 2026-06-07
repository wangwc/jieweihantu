import { createCsvAdapter } from "./base";
import type { SeedAdapterContext } from "@/lib/seed/types";

export const mediawikiTextAdapter = createCsvAdapter("text-chunk", (context: SeedAdapterContext, rows) => {
  return rows.map((row, index) => ({
    id: row.id || `seed-text-page-${index + 1}`,
    importBatchId: context.importBatchId,
    sourceId: `seed-source-${context.source.id}`,
    sourceTitle: row.sourceTitle,
    pageTitle: row.pageTitle,
    title: `${row.sourceTitle || "历史文本"}：${row.pageTitle || "待补页面"}`,
    sourceUrl: row.sourceUrl,
    dynastyOrDate: row.dynastyOrDate || "明代",
    topic: row.topic || "未分类",
    expectedLayer: row.expectedLayer || context.source.layer,
    citation: row.citationFormat || context.source.citationFormat,
    citationFormat: row.citationFormat || context.source.citationFormat,
    licenseNote: row.licenseNote || context.source.licenseNote,
    originalText: "待补原文",
    translationOrSummary: "仅为 page list 入口；未获取原文时不得生成 Evidence。",
    reviewStatus: "pending_review",
    suggestedLinks: [],
    notes: row.notes || "TextChunk 不等于 Evidence。",
    demoOnly: true,
    createdAt: context.now,
    updatedAt: context.now
  }));
});
