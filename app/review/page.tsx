import { DemoBanner } from "@/components/demo-banner";
import { LayerBadge } from "@/components/layer-badge";
import { controversialClaims, evidence, evidenceTasks, leads } from "@/lib/data";

export default function ReviewPage() {
  const pendingEvidence = evidence.filter((item) => item.verificationStatus === "未审核" || item.verificationStatus === "初审");
  const pendingLeads = leads.filter((lead) => lead.status === "待核验" || lead.status === "已拆解");
  const missingCitation = evidence.filter((item) => !item.citation || item.citation.includes("待补"));
  const missingLicense = evidence.filter((item) => !item.licenseNote);
  const riskyEvidence = evidence.filter((item) => ["D", "Q", "X"].includes(item.sourceLayer));
  const controversialPending = controversialClaims.filter((claim) => claim.status === "待核验");
  const gapTasks = evidenceTasks.filter((task) => task.status === "待补资料");
  const cards = [
    ["待审核证据", pendingEvidence.length],
    ["待拆解线索", pendingLeads.length],
    ["待补 citation", missingCitation.length],
    ["待补 license", missingLicense.length],
    ["D/X/Q 风险资料", riskyEvidence.length],
    ["争议主张待核验", controversialPending.length],
    ["待补证据任务", gapTasks.length]
  ];

  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">审核工作台</h1>
        <p className="mt-3 text-sm leading-7 text-muted">集中查看待审核证据、待拆解线索、缺 citation、缺 license 和高风险资料。</p>
      </section>
      <section className="grid gap-3 md:grid-cols-5">
        {cards.map(([label, value]) => <div key={label} className="rounded border border-line bg-card p-3"><div className="text-xs text-muted">{label}</div><div className="mt-2 text-2xl font-semibold text-ink">{value}</div></div>)}
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">待补资料任务清单</h2>
          <div className="mt-3 space-y-3">
            {missingCitation.slice(0, 8).map((item) => (
              <div key={item.id} className="rounded border border-line bg-paper p-3">
                <div className="flex flex-wrap gap-2"><LayerBadge layer={item.sourceLayer} /><span className="rounded bg-card px-2 py-1 text-xs text-muted">{item.verificationStatus}</span></div>
                <div className="mt-2 font-medium text-ink">{item.title}</div>
                <p className="mt-1 text-xs text-muted">任务：补正式 citation、位置引用和审核备注。</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">待拆解线索</h2>
          <div className="mt-3 space-y-3">
            {pendingLeads.map((lead) => (
              <div key={lead.id} className="rounded border border-line bg-paper p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium text-ink">{lead.title}</div>
                  <span className="rounded border border-line bg-card px-2 py-1 text-xs text-muted">{lead.riskLevel}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-cinnabar">{lead.riskNote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
