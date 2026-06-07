import { MediaEmbed } from "@/components/media-embed";
import { UrlPreviewCard } from "@/components/url-preview-card";
import { mediaPolicyText } from "@/lib/media";
import type { MediaAsset } from "@/lib/types";

export function MediaPreviewCard({ asset, embedded = false }: { asset: MediaAsset; embedded?: boolean }) {
  return (
    <div className="rounded border border-line bg-card p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-muted">资料媒体 · {asset.provider}</div>
          <h4 className="mt-1 text-sm font-semibold text-ink">{asset.title}</h4>
        </div>
        {asset.demoOnly ? <span className="rounded border border-cinnabar/30 bg-cinnabar/10 px-2 py-1 text-xs text-cinnabar">示例</span> : null}
      </div>
      {embedded && asset.kind === "video" ? <MediaEmbed asset={asset} /> : <UrlPreviewCard asset={asset} />}
      <div className="mt-3 grid gap-2 text-xs leading-5 text-muted">
        <p>{mediaPolicyText(asset)}</p>
        <p>版权说明：{asset.licenseNote}</p>
        <p>访问说明：{asset.accessNote}</p>
        <a href={asset.url} target="_blank" rel="noreferrer" className="font-medium text-cinnabar underline-offset-4 hover:underline">
          打开原始链接
        </a>
      </div>
    </div>
  );
}
