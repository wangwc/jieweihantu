import { LayerBadge } from "@/components/layer-badge";
import { MediaPreviewCard } from "@/components/media-preview-card";
import type { EvidenceItem } from "@/lib/types";

export function EvidenceCard({ item, showMedia = true }: { item: EvidenceItem; showMedia?: boolean }) {
  const firstMedia = item.mediaAssets[0];
  return (
    <article className="rounded border border-line bg-card p-4 shadow-archive">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <LayerBadge layer={item.sourceLayer} />
            <span className="rounded border border-line bg-paper px-2 py-1 text-xs text-muted">{item.relationToClaim}</span>
          </div>
          <h3 className="mt-3 text-base font-semibold text-ink">{item.title}</h3>
          <p className="mt-1 text-xs text-muted">{item.sourceType} · {item.authorOrInstitution} · {item.dynastyOrDate}</p>
        </div>
        {item.demoOnly ? <span className="rounded border border-cinnabar/30 bg-cinnabar/10 px-2 py-1 text-xs text-cinnabar">示例数据</span> : null}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded border border-line bg-paper p-3">
          <div className="text-xs font-medium text-muted">原文片段</div>
          <p className="mt-2 text-sm leading-6 text-ink">{item.originalText}</p>
        </div>
        <div className="rounded border border-line bg-paper p-3">
          <div className="text-xs font-medium text-muted">现代解释</div>
          <p className="mt-2 text-sm leading-6 text-ink">{item.translationOrSummary}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-2 text-xs leading-5 text-muted">
        <p>可靠性说明：{item.reliabilityNote}</p>
        <p>版权/授权：{item.licenseNote}</p>
        <p>审核备注：{item.reviewerNote}</p>
      </div>
      {showMedia && firstMedia ? (
        <div className="mt-4">
          <MediaPreviewCard asset={firstMedia} embedded={item.hasEmbeddableMedia} />
        </div>
      ) : null}
    </article>
  );
}
