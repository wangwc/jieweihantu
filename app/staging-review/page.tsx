import { DemoBanner } from "@/components/demo-banner";
import { stagingItems } from "@/lib/data";

export default function StagingReviewPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">暂存审核</h1>
        <p className="mt-3 text-sm leading-7 text-muted">统一查看 StagingSource、Lead、Claim、Evidence、TextChunk、Artifact、Territory、Person；这里只展示候选，不代表正式事实。</p>
      </section>
      <div className="grid gap-3">
        {stagingItems.map((item) => (
          <article key={item.id} className="rounded border border-line bg-card p-4 shadow-archive">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs text-muted">{item.detectedSourceType} · {item.detectedSourceLayer} · {item.importBatchId}</div>
                <h2 className="mt-1 text-base font-semibold text-ink">{item.id}</h2>
              </div>
              <span className="rounded border border-cinnabar/30 bg-cinnabar/10 px-2 py-1 text-xs text-cinnabar">{item.reviewStatus}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">置信度：{item.confidence} · 重复候选：{item.duplicateCandidateIds.join(" / ") || "无"} · 建议关联：{item.suggestedLinks.length}</p>
            {item.validationWarnings.length ? <p className="mt-2 text-xs leading-5 text-cinnabar">警告：{item.validationWarnings.join("；")}</p> : null}
            {item.validationErrors.length ? <p className="mt-2 text-xs leading-5 text-danger">错误：{item.validationErrors.join("；")}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
