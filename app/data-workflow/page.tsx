import { DemoBanner } from "@/components/demo-banner";

const steps = ["人工录入网络/文章/视频线索", "拆解为可核验主张", "查找并关联证据", "标注来源等级和媒体许可", "人工审核争议点", "形成当前判断并保留待补资料"];

export default function DataWorkflowPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">数据工作流</h1>
        <p className="mt-3 text-sm leading-7 text-muted">从线索到可核验主张，再到证据；每一步都保留来源等级、版权说明和审核备注，方便后续替换为真实人工校对资料。</p>
      </section>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="rounded border border-line bg-card p-4">
            <div className="text-xs text-cinnabar">步骤 {index + 1}</div>
            <h2 className="mt-2 text-base font-semibold text-ink">{step}</h2>
          </div>
        ))}
      </div>
      <section className="rounded border border-line bg-card p-5">
        <h2 className="text-lg font-semibold text-ink">真实资料替换路径</h2>
        <p className="mt-3 text-sm leading-7 text-muted">保持 JSON 字段不变，将示例 URL、缩略图、嵌入地址和“待录入原文”替换为人工校对后的真实资料；后续可把 `lib/data.ts` 替换为数据库、全文检索或导入脚本。</p>
      </section>
    </div>
  );
}
