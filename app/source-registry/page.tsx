import { DemoBanner } from "@/components/demo-banner";
import { LayerBadge } from "@/components/layer-badge";
import { sourceRegistry } from "@/lib/data";

export default function SourceRegistryPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">来源登记册</h1>
        <p className="mt-3 text-sm leading-7 text-muted">登记来源等级、导入方式、授权说明、引用格式、审核要求与使用边界。</p>
      </section>
      <div className="grid gap-4">
        {sourceRegistry.map((source) => (
          <article key={source.id} className="rounded border border-line bg-card p-4 shadow-archive">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <LayerBadge layer={source.sourceLayer} withNote />
                <h2 className="mt-3 text-lg font-semibold text-ink">{source.title}</h2>
                <p className="mt-1 text-xs text-muted">{source.sourceType} · {source.institution} · {source.status}</p>
              </div>
              <span className="rounded border border-line bg-paper px-2 py-1 text-xs text-muted">{source.importMethod}</span>
            </div>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-muted lg:grid-cols-3">
              <p>授权说明：{source.licenseNote}</p>
              <p>引用格式：{source.citationFormat}</p>
              <p>是否需审核：{source.reviewRequired ? "需要" : "不需要"}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-cinnabar">允许使用：{source.allowedUsage}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
