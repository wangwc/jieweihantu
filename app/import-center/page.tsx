import { DemoBanner } from "@/components/demo-banner";
import { importBatches, importRowErrors, stagingItems } from "@/lib/data";

const templates = [
  ["真实史料导入模板", "/templates/import/historical-text.template.csv"],
  ["争议主张导入模板", "/templates/import/controversial-leads.template.csv"],
  ["史料片段模板", "/templates/import/text-chunks.template.csv"],
  ["CHGIS 地理模板", "/templates/import/chgis-territory.template.csv"],
  ["CBDB 人物模板", "/templates/import/cbdb-persons.template.csv"],
  ["博物馆文物模板", "/templates/import/museum-artifacts.template.csv"]
];

const pipelines = [
  ["真实史料导入", "生成 Source 候选、TextChunk、StagingTextChunk 和 StagingEvidence，不写正式 Evidence。"],
  ["争议主张导入", "生成 Lead、争议 Claim 候选和待补证据任务，默认 pending_review。"],
  ["开放结构化数据导入", "CHGIS、CBDB、博物馆开放数据进入 StagingPerson / Territory / Artifact。"]
];

export default function ImportCenterPage() {
  const pending = stagingItems.filter((item) => item.reviewStatus === "pending_review").length;
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">导入中心</h1>
        <p className="mt-3 text-sm leading-7 text-muted">所有外部资料先进 staging；自动抽取结果只标记 pending_review，不直接写入正式事实库。</p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded border border-line bg-card p-4"><div className="text-xs text-muted">Staging 总数</div><div className="mt-2 text-3xl font-semibold">{stagingItems.length}</div></div>
        <div className="rounded border border-line bg-card p-4"><div className="text-xs text-muted">待审核</div><div className="mt-2 text-3xl font-semibold">{pending}</div></div>
        <div className="rounded border border-line bg-card p-4"><div className="text-xs text-muted">导入错误</div><div className="mt-2 text-3xl font-semibold">{importRowErrors.length}</div></div>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        {pipelines.map(([title, note]) => (
          <div key={title} className="rounded border border-line bg-card p-4">
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{note}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">模板下载</h2>
          <div className="mt-3 grid gap-2">
            {templates.map(([label, href]) => <a key={href} href={href} className="rounded border border-line bg-paper px-3 py-2 text-sm text-cinnabar">{label}</a>)}
          </div>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">最近 ImportBatch</h2>
          <div className="mt-3 space-y-2">
            {importBatches.slice(-5).map((batch) => <div key={batch.id} className="rounded bg-paper p-3 text-xs text-muted">{batch.fileName} · {batch.status} · {batch.importedAt}</div>)}
          </div>
        </div>
      </section>
    </div>
  );
}
