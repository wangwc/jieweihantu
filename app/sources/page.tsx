import { DemoBanner } from "@/components/demo-banner";
import { LayerBadge } from "@/components/layer-badge";
import { MediaPreviewCard } from "@/components/media-preview-card";
import { sources } from "@/lib/data";

export default function SourcesPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">来源管理</h1>
        <p className="mt-2 text-sm text-muted">旧来源管理页保留兼容；完整二阶段字段请查看“来源登记册”。</p>
      </div>
      <div className="grid gap-4">
        {sources.map((source) => (
          <article key={source.id} className="rounded border border-line bg-card p-4 shadow-archive">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <LayerBadge layer={source.layer} withNote />
                <h2 className="mt-3 text-lg font-semibold text-ink">{source.title}</h2>
                <p className="mt-1 text-xs text-muted">{source.sourceType} · {source.institution}</p>
              </div>
              {source.previewImageUrl ? <img src={source.previewImageUrl} alt={source.title} className="h-24 w-40 rounded object-cover" /> : null}
            </div>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-muted lg:grid-cols-3">
              <p>访问方式：{source.accessMethod}</p>
              <p>引用格式：{source.citationFormat}</p>
              <p>授权说明：{source.licenseNote}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">可靠性说明：{source.reliabilityNote}</p>
            {source.sampleMediaAssets[0] ? <div className="mt-4"><MediaPreviewCard asset={source.sampleMediaAssets[0]} /></div> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
