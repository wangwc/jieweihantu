import { DemoBanner } from "@/components/demo-banner";
import { sourceRegistry, stagingTextChunks, textChunks } from "@/lib/data";

export default function TextChunkStudioPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">史料片段工作室</h1>
        <p className="mt-3 text-sm leading-7 text-muted">TextChunk 是史料片段，不等于 Evidence。只有经过审核并关联 Claim 后，才能生成 Evidence 候选。</p>
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        {textChunks.map((chunk) => {
          const source = sourceRegistry.find((item) => item.id === chunk.sourceId);
          return (
            <article key={chunk.id} className="rounded border border-line bg-card p-4 shadow-archive">
              <div className="text-xs text-muted">{source?.title || chunk.sourceId} · {chunk.dynastyOrDate}</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">{chunk.title}</h2>
              <p className="mt-3 rounded bg-paper p-3 text-sm leading-7 text-ink">{chunk.originalText}</p>
              <p className="mt-3 text-sm leading-6 text-muted">摘要：{chunk.translationOrSummary}</p>
              <p className="mt-2 text-xs text-muted">关键词：{chunk.keywords.join(" / ")} · 推荐 Claim：{chunk.candidateClaimIds.join(" / ") || "待补"}</p>
              <p className="mt-2 text-xs text-cinnabar">状态：{chunk.reviewStatus} · 一键生成 Evidence 候选需走 review action。</p>
            </article>
          );
        })}
        {stagingTextChunks.map((item) => (
          <article key={item.id} className="rounded border border-cinnabar/30 bg-cinnabar/10 p-4">
            <div className="text-xs text-cinnabar">StagingTextChunk · {item.reviewStatus}</div>
            <h2 className="mt-1 text-lg font-semibold text-ink">{String(item.normalizedPayload.title || item.id)}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">建议关联：{item.suggestedLinks.map((link) => link.label).join(" / ") || "无"}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
