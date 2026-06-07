import { DemoBanner } from "@/components/demo-banner";

export default function MethodologyPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">主张拆解方法论</h1>
        <p className="mt-3 text-sm leading-7 text-muted">先建立待核验主张，再关联证据；证据必须说明来源等级、与主张的关系和人工审核状态。任何结论都必须能追溯到证据链。</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {[
          ["拆解", "把清修叙事拆为可核验的最小主张，避免使用笼统评价词。"],
          ["关联", "证据必须标注支持、反驳、部分支持、部分反驳、背景或线索。"],
          ["降权", "清修叙事为 Q 级待核验对象；网络与短视频为 D/X 级线索。"],
          ["审核", "当前判断使用审慎表达，保留争议点和待补资料。"]
        ].map(([title, note]) => (
          <div key={title} className="rounded border border-line bg-card p-4">
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{note}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
