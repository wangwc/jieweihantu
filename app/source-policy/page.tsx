import { DemoBanner } from "@/components/demo-banner";
import { LayerBadge } from "@/components/layer-badge";
import type { SourceLayer } from "@/lib/types";

const layers: SourceLayer[] = ["S", "A", "B", "C", "D", "Q", "X"];

export default function SourcePolicyPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">来源政策</h1>
        <p className="mt-3 text-sm leading-7 text-muted">本系统不把清修《明史》或清代官方叙事作为事实依据；它们只作为待核验对象。网络文章、短视频和论坛内容只作为线索。</p>
      </section>
      <section className="grid gap-3">
        {layers.map((layer) => (
          <div key={layer} className="rounded border border-line bg-card p-4">
            <LayerBadge layer={layer} withNote />
          </div>
        ))}
      </section>
      <section className="rounded border border-line bg-card p-5">
        <h2 className="text-lg font-semibold text-ink">媒体与平台规则</h2>
        <div className="mt-3 grid gap-3 text-sm leading-7 text-muted">
          <p>只使用人工录入的公开 URL、缩略图和平台允许的嵌入地址。</p>
          <p>不实现绕过登录、反爬、风控、付费墙或平台限制的采集。</p>
          <p>博物馆图像、数据库截图和档案图片必须记录版权说明、访问方式和引用规则。</p>
          <p>D/X 级媒体即使可以播放，也不能直接作为历史结论。</p>
        </div>
      </section>
    </div>
  );
}
