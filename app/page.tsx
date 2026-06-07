import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";
import { LayerBadge } from "@/components/layer-badge";
import { StatCard } from "@/components/stat-card";
import { claims, emperors, evidence, importBatches, leads } from "@/lib/data";
import { layerDistribution } from "@/lib/metrics";
import type { SourceLayer } from "@/lib/types";

export default function DashboardPage() {
  const distribution = layerDistribution(evidence);
  const topControversy = [...claims].sort((a, b) => b.controversy - a.controversy).slice(0, 4);
  const mediaEvidence = evidence.filter((item) => item.hasImage || item.hasVideo || item.url).length;
  const pendingEvidence = evidence.filter((item) => item.verificationStatus === "未审核" || item.verificationStatus === "初审").length;
  const missingCitation = evidence.filter((item) => !item.citation || item.citation.includes("待补")).length;
  const missingLicense = evidence.filter((item) => !item.licenseNote).length;

  return (
    <div className="space-y-6">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <div className="text-xs uppercase tracking-[0.24em] text-muted">Ming Evidence Atlas</div>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">大明辨证录证据工作台</h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
          当前系统用于多源证据校验。清修《明史》及清代官方叙事在本系统中为待核验对象，不作为事实依据。网络与短视频内容仅作为线索。
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="待核验清修叙事" value={claims.length} note="每条主张都需要证据链支撑或反证。" />
        <StatCard label="已建立证据链" value={claims.filter((claim) => claim.evidenceIds.length > 0).length} note="包含支持、反驳、背景和线索关系。" />
        <StatCard label="带媒体资料的证据" value={mediaEvidence} note="支持图片、网页卡片和安全视频嵌入。" />
        <StatCard label="网络线索池" value={leads.length} note="D/X级线索不能直接作为结论。" />
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="待审核证据" value={pendingEvidence} note="进入审核工作台复核来源、引用和关系。" />
        <StatCard label="待补 citation" value={missingCitation} note="真实资料导入前必须补正式引用。" />
        <StatCard label="待补 license" value={missingLicense} note="图片、馆藏、文献必须保留授权说明。" />
        <StatCard label="导入批次" value={importBatches.length} note="所有导入都必须生成可审计批次记录。" />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded border border-line bg-card p-4 shadow-archive">
          <h2 className="text-lg font-semibold text-ink">争议最高榜</h2>
          <div className="mt-4 space-y-3">
            {topControversy.map((claim) => (
              <Link key={claim.id} href={`/claims/${claim.id}`} className="focus-ring block rounded border border-line bg-paper p-3 hover:border-cinnabar/50">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-ink">{claim.title}</span>
                  <span className="text-sm text-cinnabar">{claim.controversy}</span>
                </div>
                <p className="mt-2 text-xs text-muted">{claim.currentAssessment}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded border border-line bg-card p-4 shadow-archive">
          <h2 className="text-lg font-semibold text-ink">来源等级分布</h2>
          <div className="mt-4 grid gap-2">
            {(Object.keys(distribution) as SourceLayer[]).map((layer) => (
              <div key={layer} className="flex items-center justify-between rounded bg-paper px-3 py-2">
                <LayerBadge layer={layer} />
                <span className="text-sm font-semibold text-ink">{distribution[layer]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/data-import" className="focus-ring rounded border border-line bg-panel p-4 text-card hover:border-gold">
          <div className="text-xs text-gold">二阶段入口</div>
          <h2 className="mt-2 text-xl font-semibold">数据导入</h2>
          <p className="mt-2 text-sm leading-6 text-card/75">模板、导入批次、校验规则和错误报告示例。</p>
        </Link>
        <Link href="/review" className="focus-ring rounded border border-line bg-panel p-4 text-card hover:border-gold">
          <div className="text-xs text-gold">二阶段入口</div>
          <h2 className="mt-2 text-xl font-semibold">审核工作台</h2>
          <p className="mt-2 text-sm leading-6 text-card/75">待审核证据、待拆解线索和高风险资料。</p>
        </Link>
        <Link href="/rankings" className="focus-ring rounded border border-line bg-panel p-4 text-card hover:border-gold">
          <div className="text-xs text-gold">二阶段入口</div>
          <h2 className="mt-2 text-xl font-semibold">排行榜</h2>
          <p className="mt-2 text-sm leading-6 text-card/75">争议度、反证强度、证据充分度和线索热度。</p>
        </Link>
        <Link href="/emperors" className="focus-ring rounded border border-line bg-panel p-4 text-card hover:border-gold">
          <div className="text-xs text-gold">入口</div>
          <h2 className="mt-2 text-xl font-semibold">皇帝评价重估</h2>
          <p className="mt-2 text-sm leading-6 text-card/75">{emperors.length} 位皇帝，以多维证据替代单一褒贬。</p>
        </Link>
        <Link href="/territory" className="focus-ring rounded border border-line bg-panel p-4 text-card hover:border-gold">
          <div className="text-xs text-gold">入口</div>
          <h2 className="mt-2 text-xl font-semibold">疆域证据地图</h2>
          <p className="mt-2 text-sm leading-6 text-card/75">用控制层级和证据点位表达历史地理关系。</p>
        </Link>
        <Link href="/leads" className="focus-ring rounded border border-line bg-panel p-4 text-card hover:border-gold">
          <div className="text-xs text-gold">入口</div>
          <h2 className="mt-2 text-xl font-semibold">网络线索池</h2>
          <p className="mt-2 text-sm leading-6 text-card/75">视频、文章和论坛内容先降权，再人工拆解。</p>
        </Link>
      </section>
    </div>
  );
}
