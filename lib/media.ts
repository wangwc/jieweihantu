import type { MediaAsset } from "@/lib/types";

const allowedEmbedHosts = [
  "youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "player.bilibili.com"
];

export function isAllowedEmbedUrl(embedUrl?: string): boolean {
  if (!embedUrl) return false;

  try {
    const host = new URL(embedUrl).hostname;
    return allowedEmbedHosts.includes(host);
  } catch {
    return false;
  }
}

export function primaryMedia(mediaAssets: MediaAsset[], primaryMediaId?: string): MediaAsset | undefined {
  return mediaAssets.find((asset) => asset.id === primaryMediaId) ?? mediaAssets[0];
}

export function mediaPolicyText(asset?: MediaAsset): string {
  if (!asset) return "未提供媒体资料。";
  if (asset.kind === "video") {
    return "视频资料仅作为可核验线索或来源入口；是否构成证据取决于其关联来源等级与人工审核。";
  }
  return "媒体资料用于展示来源入口、图像线索与引用上下文，需遵守版权与访问限制。";
}
