import { createCsvAdapter } from "./base";
import type { SeedAdapterContext } from "@/lib/seed/types";

function splitList(value = "") {
  return value.split(/[;；|]/).map((item) => item.trim()).filter(Boolean);
}

export const controversialUrlListAdapter = createCsvAdapter("controversial-claim", (context: SeedAdapterContext, rows) => {
  return rows.map((row, index) => ({
    id: row.id || `seed-controversial-${index + 1}`,
    importBatchId: context.importBatchId,
    sourceId: `seed-source-${context.source.id}`,
    title: row.title,
    claimText: row.claimText,
    topic: row.topic || "未分类",
    relatedPeriod: row.relatedPeriod,
    relatedPersons: splitList(row.relatedPersons),
    relatedPlaces: splitList(row.relatedPlaces),
    sourcePlatform: row.sourcePlatform || "Website",
    sourceUrl: row.sourceUrl,
    sourceTitle: row.sourceTitle,
    sourceAuthor: row.sourceAuthor,
    rawSummary: row.rawSummary || row.claimText,
    extractedQuestions: splitList(row.extractedQuestions),
    defaultLayer: "D/X",
    controversial: true,
    riskLevel: row.riskLevel || "medium",
    reviewStatus: "pending_review",
    assessment: "待核验",
    conclusion: "不作为事实结论",
    citation: row.sourceUrl || context.source.citationFormat,
    licenseNote: row.licenseNote || context.source.licenseNote,
    notes: row.notes || "网络争议主张只能作为待核验线索。",
    suggestedLinks: [],
    demoOnly: true,
    createdAt: context.now,
    updatedAt: context.now
  }));
});
