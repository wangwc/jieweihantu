import { isAllowedEmbedUrl } from "@/lib/media";
import type { MediaAsset } from "@/lib/types";

export function MediaEmbed({ asset }: { asset: MediaAsset }) {
  if (!isAllowedEmbedUrl(asset.embedUrl)) {
    return (
      <div className="rounded border border-line bg-paper p-3">
        {asset.thumbnailUrl ? <img src={asset.thumbnailUrl} alt={asset.title} className="aspect-video w-full rounded object-cover" /> : null}
        <p className="mt-2 text-xs leading-5 text-muted">该媒体未提供允许嵌入的公开地址，已回退为预览图与外链。</p>
      </div>
    );
  }

  return (
    <iframe
      className="aspect-video w-full rounded border border-line bg-panel"
      src={asset.embedUrl}
      title={asset.title}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}
