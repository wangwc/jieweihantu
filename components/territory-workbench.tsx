"use client";

import { useMemo, useState } from "react";
import { territoryLayers } from "@/lib/data";

const colorByType: Record<string, string> = {
  "直接行政区": "#9E2F1C",
  "军事控制区": "#B08A45",
  "羁縻册封": "#2F6F73",
  "短期占领": "#8B2C2C",
  "航海影响区": "#4f7c9b",
  "名义声索区": "#7A6A55",
  "争议区": "#171412"
};

export function TerritoryWorkbench() {
  const [year, setYear] = useState(1420);
  const [activeType, setActiveType] = useState("全部图层");
  const types = ["全部图层", ...Array.from(new Set(territoryLayers.map((layer) => layer.controlType)))];
  const visible = useMemo(() => territoryLayers.filter((layer) => year >= layer.yearStart && year <= layer.yearEnd && (activeType === "全部图层" || layer.controlType === activeType)), [year, activeType]);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded border border-line bg-panel p-4 text-card shadow-archive">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">历史地理工作台</h2>
            <p className="mt-1 text-xs text-card/70">简化点位图，仅演示控制层级，不代表现代主权边界。</p>
          </div>
          <span className="rounded border border-gold/50 px-2 py-1 text-xs text-gold">{year} 年</span>
        </div>
        <svg viewBox="0 0 760 420" className="mt-4 aspect-[16/9] w-full rounded border border-card/20 bg-[#201c18]">
          <path d="M120 105 C210 45 342 55 440 96 C560 145 610 230 555 310 C500 389 335 386 215 330 C105 278 52 182 120 105Z" fill="#2c2722" stroke="#6f675d" strokeWidth="2" />
          <path d="M440 190 C535 205 625 244 685 318" fill="none" stroke="#2F6F73" strokeDasharray="8 8" strokeWidth="2" />
          {visible.map((layer) => {
            const [lng, lat] = layer.geojson.geometry.coordinates;
            const x = 90 + ((lng - 85) / 45) * 560;
            const y = 330 - ((lat - 10) / 35) * 250;
            return (
              <g key={layer.id}>
                <circle cx={x} cy={y} r="9" fill={colorByType[layer.controlType]} stroke="#FFFDF8" strokeWidth="2" />
                <text x={x + 13} y={y + 4} fill="#FFFDF8" fontSize="13">{layer.geojson.properties.label}</text>
              </g>
            );
          })}
        </svg>
      </section>
      <aside className="space-y-4">
        <div className="rounded border border-line bg-card p-4">
          <h3 className="text-sm font-semibold text-ink">图层控制</h3>
          <label className="mt-3 block text-xs text-muted">年份滑块</label>
          <input className="mt-2 w-full accent-cinnabar" type="range" min={1368} max={1644} value={year} onChange={(event) => setYear(Number(event.target.value))} />
          <select className="focus-ring mt-3 w-full rounded border border-line bg-paper px-3 py-2 text-sm" value={activeType} onChange={(event) => setActiveType(event.target.value)}>
            {types.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <h3 className="text-sm font-semibold text-ink">当前证据点</h3>
          <div className="mt-3 space-y-3">
            {visible.map((layer) => (
              <div key={layer.id} className="rounded border border-line bg-paper p-3">
                <div className="font-medium text-ink">{layer.title}</div>
                <div className="mt-1 text-xs text-muted">{layer.controlType} · {layer.yearStart}-{layer.yearEnd}</div>
                <p className="mt-2 text-xs leading-5 text-muted">{layer.note}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
