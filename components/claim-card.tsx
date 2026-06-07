import Link from "next/link";
import { LayerBadge } from "@/components/layer-badge";
import { evidenceCounts } from "@/lib/metrics";
import type { EvidenceItem, HistoricalClaim } from "@/lib/types";

export function ClaimCard({ claim, evidence }: { claim: HistoricalClaim; evidence: EvidenceItem[] }) {
  const counts = evidenceCounts(claim, evidence);
  return (
    <Link href={`/claims/${claim.id}`} className="focus-ring block rounded border border-line bg-card p-4 shadow-archive hover:border-cinnabar/50">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded border border-line bg-paper px-2 py-1 text-xs text-muted">{claim.topic}</span>
            <span className="rounded border border-line bg-paper px-2 py-1 text-xs text-muted">{claim.period.emperor} · {claim.period.reignTitle}</span>
            <LayerBadge layer={claim.confidenceLevel} />
          </div>
          <h3 className="mt-3 text-lg font-semibold text-ink">{claim.title}</h3>
        </div>
        <span className="rounded border border-cinnabar/30 bg-cinnabar/10 px-2 py-1 text-xs text-cinnabar">待核验</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">清修叙事：{claim.qingNarrative.text}</p>
      <p className="mt-2 text-sm leading-6 text-ink">核验问题：{claim.counterQuestion}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
        <span className="rounded bg-paper px-2 py-2">当前判断：{claim.currentAssessment}</span>
        <span className="rounded bg-paper px-2 py-2">证据：{counts.total}</span>
        <span className="rounded bg-paper px-2 py-2">反驳：{counts.rebuttal}</span>
        <span className="rounded bg-paper px-2 py-2">支持：{counts.support}</span>
        <span className="rounded bg-paper px-2 py-2">争议度：{claim.controversy}</span>
      </div>
    </Link>
  );
}
