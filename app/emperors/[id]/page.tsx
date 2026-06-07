import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/demo-banner";
import { ClaimCard } from "@/components/claim-card";
import { evidence, getClaimsForEmperor, getEmperor } from "@/lib/data";

export default function EmperorDetailPage({ params }: { params: { id: string } }) {
  const emperor = getEmperor(params.id);
  if (!emperor) notFound();
  const relatedClaims = getClaimsForEmperor(emperor.name);

  return (
    <div className="space-y-5">
      <DemoBanner />
      <Link href="/emperors" className="text-sm text-cinnabar hover:underline">返回皇帝重估</Link>
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">{emperor.name}</h1>
        <p className="mt-2 text-sm text-muted">{emperor.reignTitle} · {emperor.reignYears}</p>
        <p className="mt-4 text-sm leading-7 text-ink">{emperor.summary}</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">多维评价框架</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {emperor.reassessmentDimensions.map((item) => <span key={item} className="rounded bg-paper px-3 py-2 text-sm text-muted">{item}</span>)}
          </div>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">证据计数</h2>
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
            <span className="rounded bg-paper p-3">正向证据 {emperor.positiveEvidenceCount}</span>
            <span className="rounded bg-paper p-3">负向证据 {emperor.negativeEvidenceCount}</span>
            <span className="rounded bg-paper p-3">争议证据 {emperor.disputedEvidenceCount}</span>
          </div>
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">关联主张</h2>
        <div className="grid gap-4">
          {relatedClaims.map((claim) => <ClaimCard key={claim.id} claim={claim} evidence={evidence} />)}
        </div>
      </section>
    </div>
  );
}
