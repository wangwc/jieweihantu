"use client";

import { useMemo, useState } from "react";
import { DemoBanner } from "@/components/demo-banner";
import { EvidenceCard } from "@/components/evidence-card";
import { FilterBar } from "@/components/filter-bar";
import { evidence } from "@/lib/data";

export default function EvidencePage() {
  const [search, setSearch] = useState("");
  const [layer, setLayer] = useState("全部等级");
  const [media, setMedia] = useState("全部媒体");
  const layers = ["全部等级", "S", "A", "B", "C", "D", "Q", "X"];
  const mediaOptions = ["全部媒体", "有图片", "有视频", "有URL", "可嵌入"];
  const filtered = useMemo(() => evidence.filter((item) => {
    const keyword = `${item.title} ${item.sourceType} ${item.translationOrSummary}`.includes(search);
    const layerOk = layer === "全部等级" || item.sourceLayer === layer;
    const mediaOk =
      media === "全部媒体" ||
      (media === "有图片" && item.hasImage) ||
      (media === "有视频" && item.hasVideo) ||
      (media === "有URL" && Boolean(item.url)) ||
      (media === "可嵌入" && item.hasEmbeddableMedia);
    return keyword && layerOk && mediaOk;
  }), [search, layer, media]);

  return (
    <div className="space-y-5">
      <DemoBanner />
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">证据库</h1>
        <p className="mt-2 text-sm text-muted">证据不是孤立资料，必须说明来源等级、与主张的关系、媒体版权和审核状态。</p>
      </div>
      <FilterBar search={search} onSearch={setSearch}>
        <select className="focus-ring rounded border border-line bg-paper px-3 py-2 text-sm" value={layer} onChange={(event) => setLayer(event.target.value)}>
          {layers.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="focus-ring rounded border border-line bg-paper px-3 py-2 text-sm" value={media} onChange={(event) => setMedia(event.target.value)}>
          {mediaOptions.map((item) => <option key={item}>{item}</option>)}
        </select>
      </FilterBar>
      <div className="grid gap-4">
        {filtered.map((item) => <EvidenceCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
