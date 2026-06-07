import type { MediaAsset } from "@/lib/types";

const kindLabel: Record<MediaAsset["kind"], string> = {
  image: "图片",
  video: "视频",
  webpage: "网页",
  archive: "档案",
  document: "文档"
};

export function UrlPreviewCard({ asset }: { asset: MediaAsset }) {
  return (
    <a href={asset.url} target="_blank" rel="noreferrer" className="focus-ring grid gap-3 rounded border border-line bg-card p-3 hover:border-cinnabar/50 sm:grid-cols-[120px_1fr]">
      {asset.thumbnailUrl ? <img src={asset.thumbnailUrl} alt={asset.title} className="h-24 w-full rounded object-cover sm:w-28" /> : <div className="h-24 rounded bg-paper" />}
      <div>
        <div className="text-xs text-muted">{asset.provider} · {kindLabel[asset.kind]}</div>
        <div className="mt-1 text-sm font-semibold text-ink">{asset.title}</div>
        <div className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{asset.caption}</div>
      </div>
    </a>
  );
}
