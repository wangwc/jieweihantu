import { DemoBanner } from "@/components/demo-banner";
import { controversialClaims, evidenceTasks, stagingClaims, stagingLeads } from "@/lib/data";

export default function ControversialClaimStudioPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">争议主张工作室</h1>
        <p className="mt-3 text-sm leading-7 text-muted">Lead 原文和 AI 拆解主张只进入待核验流程；D/X/Q 不增加可信度，不直接关联 Territory 或 Person 为事实关系。</p>
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        {controversialClaims.map((claim) => (
          <article key={claim.id} className="rounded border border-line bg-card p-4 shadow-archive">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-ink">{claim.title}</h2>
              <span className="rounded border border-cinnabar/30 bg-cinnabar/10 px-2 py-1 text-xs text-cinnabar">{claim.status}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink">标准化主张：{claim.normalizedClaim}</p>
            <p className="mt-2 text-xs leading-5 text-muted">{claim.aiDecompositionNote}</p>
            <p className="mt-2 text-xs text-cinnabar">风险：{claim.riskLevel} · 待补任务：{claim.requiredEvidenceTasks.length}</p>
          </article>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">Staging Lead</h2>
          <div className="mt-3 space-y-2">{stagingLeads.map((lead) => <div key={lead.id} className="rounded bg-paper p-3 text-xs text-muted">{lead.id} · {lead.reviewStatus} · {lead.validationWarnings.join("；")}</div>)}</div>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">Staging Claim</h2>
          <div className="mt-3 space-y-2">{stagingClaims.map((claim) => <div key={claim.id} className="rounded bg-paper p-3 text-xs text-muted">{claim.id} · {claim.reviewStatus} · 建议关联 {claim.suggestedLinks.length}</div>)}</div>
        </div>
      </section>
    </div>
  );
}
