import type { HistoricalClaim } from "../lib/types";
import { runImport } from "./lib/importer";

const now = () => new Date().toISOString();

runImport<HistoricalClaim>({
  inputPath: "",
  targetFile: "claims.json",
  entityType: "claim",
  mapRow: (row) => ({
    id: String(row.id || ""),
    title: String(row.title || ""),
    topic: String(row.topic || "争议事件") as HistoricalClaim["topic"],
    period: {
      emperor: String(row.emperor || ""),
      reignTitle: String(row.reignTitle || ""),
      yearStart: Number(row.yearStart || 0),
      yearEnd: Number(row.yearEnd || 0)
    },
    qingNarrative: {
      text: String(row.qingNarrativeText || ""),
      sourceTitle: String(row.qingSourceTitle || "清修叙事待核验对象"),
      volume: String(row.volume || "待核验条目"),
      originalText: String(row.originalText || "待录入原文"),
      url: String(row.url || ""),
      note: String(row.note || "Q级待核验对象，不作为事实依据。")
    },
    counterQuestion: String(row.counterQuestion || ""),
    currentAssessment: String(row.currentAssessment || "暂无法判断") as HistoricalClaim["currentAssessment"],
    evidenceIds: String(row.evidenceIds || "").split("|").filter(Boolean),
    leadIds: String(row.leadIds || "").split("|").filter(Boolean),
    sourceIds: String(row.sourceIds || "").split("|").filter(Boolean),
    conclusion: String(row.conclusion || "待人工审核。"),
    confidenceLevel: String(row.confidenceLevel || "C") as HistoricalClaim["confidenceLevel"],
    controversy: Number(row.controversy || 0),
    reviewStatus: String(row.reviewStatus || "draft") as HistoricalClaim["reviewStatus"],
    reviewNotes: String(row.reviewNotes || "示例或待审核主张。"),
    tags: String(row.tags || "").split("|").filter(Boolean),
    demoOnly: String(row.demoOnly || "true") !== "false",
    createdAt: String(row.createdAt || now()),
    updatedAt: String(row.updatedAt || now())
  }),
  validateRows: (rows) => ({
    errors: rows.flatMap((row) => [
      !row.id ? "主张缺少 id" : "",
      !row.title ? `主张 ${row.id} 缺少 title` : "",
      !row.counterQuestion ? `主张 ${row.id} 缺少 counterQuestion` : ""
    ].filter(Boolean)),
    warnings: rows.flatMap((row) => (row.demoOnly && !row.reviewNotes.includes("示例") ? [`主张 ${row.id} demo 标记说明不明显`] : []))
  })
});
