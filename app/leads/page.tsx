import { DemoBanner } from "@/components/demo-banner";
import { MediaPreviewCard } from "@/components/media-preview-card";
import { leads } from "@/lib/data";

export default function LeadsPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">网络与短视频线索池</h1>
        <p className="mt-2 text-sm text-cinnabar">D/X 级线索不能直接作为历史结论；只能人工拆解为待核验主张，再寻找更高等级证据。</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded border border-line bg-card p-4 shadow-archive">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs text-muted">{lead.platform} · {lead.publishDate}</div>
                <h2 className="mt-1 text-lg font-semibold text-ink">{lead.title}</h2>
              </div>
              <span className="rounded border border-line bg-paper px-2 py-1 text-xs text-muted">{lead.status}</span>
            </div>
            <div className="mt-3 rounded border border-cinnabar/30 bg-cinnabar/10 p-3 text-xs leading-5 text-cinnabar">{lead.riskNote}</div>
            <div className="mt-3 text-sm leading-6 text-muted">提取主张：{lead.extractedClaims.join(" / ")}</div>
            <div className="mt-3 text-xs leading-5 text-muted">平台政策：{lead.platformPolicyNote}</div>
            {lead.mediaAssets[0] ? <div className="mt-4"><MediaPreviewCard asset={lead.mediaAssets[0]} embedded={Boolean(lead.embedUrl)} /></div> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
