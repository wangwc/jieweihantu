import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";
import { emperors } from "@/lib/data";

export default function EmperorsPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">皇帝评价重估</h1>
        <p className="mt-2 text-sm text-muted">不做排行榜，不做洗白或抹黑；按政治治理、财政、军事、外交与后世叙事拆分评价维度。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {emperors.map((emperor) => (
          <Link key={emperor.id} href={`/emperors/${emperor.id}`} className="focus-ring rounded border border-line bg-card p-4 shadow-archive hover:border-cinnabar/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">{emperor.name}</h2>
                <p className="mt-1 text-xs text-muted">{emperor.reignTitle} · {emperor.reignYears}</p>
              </div>
              <span className="rounded border border-cinnabar/30 bg-cinnabar/10 px-2 py-1 text-xs text-cinnabar">示例</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">清修标签：{emperor.qingLabel}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {emperor.reassessmentDimensions.slice(0, 4).map((item) => <span key={item} className="rounded bg-paper px-2 py-1 text-xs text-muted">{item}</span>)}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <span className="rounded bg-paper px-2 py-2">正向 {emperor.positiveEvidenceCount}</span>
              <span className="rounded bg-paper px-2 py-2">负向 {emperor.negativeEvidenceCount}</span>
              <span className="rounded bg-paper px-2 py-2">争议 {emperor.disputedEvidenceCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
