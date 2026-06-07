import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";
import { claims, evidence, leads, rankings } from "@/lib/data";
import { calculateRankingMetrics, rankingExplanation } from "@/lib/ranking";

const metricRows = rankings.length ? rankings : calculateRankingMetrics(claims, evidence, leads, "demo-runtime");
const claimMap = new Map(claims.map((claim) => [claim.id, claim]));
const explanations = rankingExplanation();

function Board({ title, note, field }: { title: string; note: string; field: "controversyScore" | "refutationStrengthScore" | "evidenceCompletenessScore" | "leadHeatScore" }) {
  const rows = [...metricRows].sort((a, b) => b[field] - a[field]).slice(0, 6);
  return (
    <section className="rounded border border-line bg-card p-4 shadow-archive">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-xs leading-5 text-muted">{note}</p>
      <div className="mt-4 space-y-3">
        {rows.map((row) => {
          const claim = claimMap.get(row.claimId);
          if (!claim) return null;
          return (
            <Link key={row.claimId} href={`/claims/${row.claimId}`} className="focus-ring block rounded border border-line bg-paper p-3 hover:border-cinnabar/50">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-ink">{claim.title}</span>
                <span className="text-sm font-semibold text-cinnabar">{row[field]}</span>
              </div>
              <p className="mt-2 text-xs text-muted">证据 {row.evidenceCount} · 反驳 {row.refuteCount} · 线索 {row.leadCount}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function RankingsPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">排行榜</h1>
        <p className="mt-3 text-sm leading-7 text-muted">分数是平台内部参考指标，不是历史真理。D/X 只增加线索热度，Q 不计入事实强度。</p>
      </section>
      <div className="grid gap-4 xl:grid-cols-2">
        <Board title="争议度排行" note={explanations.controversy} field="controversyScore" />
        <Board title="反证强度排行" note={explanations.refutation} field="refutationStrengthScore" />
        <Board title="证据充分度排行" note={explanations.completeness} field="evidenceCompletenessScore" />
        <Board title="线索热度排行" note={explanations.heat} field="leadHeatScore" />
      </div>
    </div>
  );
}
