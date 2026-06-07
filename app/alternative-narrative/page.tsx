import { DemoBanner } from "@/components/demo-banner";
import { controversialClaims, evidenceTasks, alternativeRankings } from "@/lib/data";
import { calculateAlternativeRankings } from "@/lib/alternative-narrative";

const rankings = alternativeRankings.length ? alternativeRankings : calculateAlternativeRankings(controversialClaims, evidenceTasks, "demo-runtime");
const claimMap = new Map(controversialClaims.map((claim) => [claim.id, claim]));

function RankingBoard({ title, field, note }: { title: string; field: "networkControversyScore" | "evidenceGapScore"; note: string }) {
  const rows = [...rankings].sort((a, b) => b[field] - a[field]).slice(0, 6);
  return (
    <section className="rounded border border-line bg-card p-4 shadow-archive">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-xs leading-5 text-muted">{note}</p>
      <div className="mt-4 space-y-3">
        {rows.map((row) => {
          const claim = claimMap.get(row.controversialClaimId);
          if (!claim) return null;
          return (
            <div key={row.controversialClaimId} className="rounded border border-line bg-paper p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-medium text-ink">{claim.title}</span>
                <span className="text-sm font-semibold text-cinnabar">{row[field]}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">状态：{claim.status} · 风险：{claim.riskLevel} · 待补任务：{row.missingEvidenceTaskCount}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function AlternativeNarrativePage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <div className="text-xs uppercase tracking-[0.22em] text-muted">Alternative Narrative Framework</div>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">争议叙事框架</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          URL、文章和字幕导入后只进入争议主张暂存层。AI 自动拆解结果默认“待核验”，并自动生成待补证据任务；未经 Evidence 审核，不得进入事实数据库。
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded border border-cinnabar/30 bg-cinnabar/10 p-4 text-cinnabar">
          <h2 className="text-base font-semibold">安全边界</h2>
          <p className="mt-2 text-sm leading-6">争议主张、Speculative Source、字幕拆解结果均不构成事实证据。</p>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-base font-semibold text-ink">默认状态</h2>
          <p className="mt-2 text-sm leading-6 text-muted">所有争议主张默认：待核验。</p>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-base font-semibold text-ink">进入证据链条件</h2>
          <p className="mt-2 text-sm leading-6 text-muted">必须补 S/A/B/C 来源、citation、licenseNote，并经过 Evidence 审核流程。</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <RankingBoard title="网络争议排行榜" field="networkControversyScore" note="按风险等级、来源类型和待补任务计算；热度不等于可信度。" />
        <RankingBoard title="证据缺口排行榜" field="evidenceGapScore" note="按待补任务数量、高优先级任务和缺少关联事实主张情况计算。" />
      </section>

      <section className="rounded border border-line bg-card p-4 shadow-archive">
        <h2 className="text-lg font-semibold text-ink">Controversial Claim 暂存池</h2>
        <div className="mt-4 grid gap-3">
          {controversialClaims.map((claim) => (
            <article key={claim.id} className="rounded border border-line bg-paper p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted">{claim.platform} · {claim.sourceKind} · {claim.riskLevel}</div>
                  <h3 className="mt-1 text-base font-semibold text-ink">{claim.title}</h3>
                </div>
                <span className="rounded border border-cinnabar/30 bg-cinnabar/10 px-2 py-1 text-xs text-cinnabar">{claim.status}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink">标准化主张：{claim.normalizedClaim}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{claim.aiDecompositionNote}</p>
              <p className="mt-2 text-xs leading-5 text-cinnabar">审核要求：{claim.reviewerNote}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded border border-line bg-card p-4 shadow-archive">
        <h2 className="text-lg font-semibold text-ink">自动生成的待补证据任务</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {evidenceTasks.map((task) => (
            <div key={task.id} className="rounded border border-line bg-paper p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-ink">{task.title}</span>
                <span className="rounded border border-line bg-card px-2 py-1 text-xs text-muted">{task.priority}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">{task.description}</p>
              <p className="mt-2 text-xs leading-5 text-cinnabar">状态：{task.status} · 需要来源：{task.requiredSourceLayers.join("/")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
