import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/demo-banner";
import { EvidenceChain } from "@/components/evidence-chain";
import { LayerBadge } from "@/components/layer-badge";
import { getClaim, getEvidenceForClaim } from "@/lib/data";

export default function ClaimDetailPage({ params }: { params: { id: string } }) {
  const claim = getClaim(params.id);
  if (!claim) notFound();
  const items = getEvidenceForClaim(claim.id);

  return (
    <div className="space-y-5">
      <DemoBanner />
      <Link href="/claims" className="text-sm text-cinnabar hover:underline">返回清修叙事对照</Link>
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <div className="flex flex-wrap gap-2">
          <span className="rounded border border-line bg-paper px-2 py-1 text-xs text-muted">{claim.topic}</span>
          <span className="rounded border border-line bg-paper px-2 py-1 text-xs text-muted">{claim.period.emperor} · {claim.period.reignTitle}</span>
          <LayerBadge layer={claim.confidenceLevel} />
        </div>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">{claim.title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{claim.conclusion}</p>
      </section>
      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr_0.6fr]">
        <aside className="space-y-4">
          <div className="rounded border border-line bg-card p-4">
            <h2 className="text-sm font-semibold text-ink">清修叙事原文</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{claim.qingNarrative.originalText}</p>
            <p className="mt-3 text-sm leading-6 text-ink">{claim.qingNarrative.text}</p>
            <p className="mt-3 text-xs leading-5 text-cinnabar">{claim.qingNarrative.note}</p>
          </div>
          <div className="rounded border border-line bg-card p-4">
            <h2 className="text-sm font-semibold text-ink">核验问题</h2>
            <p className="mt-3 text-sm leading-6 text-ink">{claim.counterQuestion}</p>
          </div>
        </aside>
        <main>
          <h2 className="mb-3 text-lg font-semibold text-ink">证据链</h2>
          <EvidenceChain evidence={items} />
        </main>
        <aside className="space-y-4">
          <div className="rounded border border-line bg-card p-4">
            <h2 className="text-sm font-semibold text-ink">当前判断</h2>
            <p className="mt-3 text-sm leading-6 text-cinnabar">{claim.currentAssessment}</p>
          </div>
          <div className="rounded border border-line bg-card p-4">
            <h2 className="text-sm font-semibold text-ink">争议点</h2>
            <p className="mt-3 text-sm leading-6 text-muted">争议度：{claim.controversy}</p>
            <p className="mt-2 text-sm leading-6 text-muted">标签：{claim.tags.join(" / ")}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
