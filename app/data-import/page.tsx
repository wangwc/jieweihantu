import { DemoBanner } from "@/components/demo-banner";
import { importBatches } from "@/lib/data";

const templates = [
  ["来源登记模板", "/templates/sources.template.csv"],
  ["网络线索模板", "/templates/leads.template.csv"],
  ["主张模板", "/templates/claims.template.csv"],
  ["证据模板", "/templates/evidence.template.csv"],
  ["文物/图像模板", "/templates/artifacts.template.csv"],
  ["疆域图层模板", "/templates/territory.template.csv"]
];

const rules = ["默认 dry-run，不写入数据文件", "传入 --write 后才合并到 data/*.json", "所有导入生成 ImportBatch", "D/X 只能作为线索", "Q 级只作为待核验对象", "证据必须有 sourceId、licenseNote 和 citation"];

export default function DataImportPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">数据导入</h1>
        <p className="mt-3 text-sm leading-7 text-muted">通过人工录入、CSV/JSON 和开放数据导入本地 JSON；不做平台抓取，不绕过登录、反爬、风控或付费墙。</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">模板入口</h2>
          <div className="mt-3 grid gap-2">
            {templates.map(([label, href]) => (
              <a key={href} href={href} className="focus-ring rounded border border-line bg-paper px-3 py-2 text-sm text-cinnabar hover:border-cinnabar">
                {label} · {href}
              </a>
            ))}
          </div>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">校验规则</h2>
          <div className="mt-3 grid gap-2">
            {rules.map((rule) => <div key={rule} className="rounded bg-paper px-3 py-2 text-sm text-muted">{rule}</div>)}
          </div>
        </div>
      </section>
      <section className="rounded border border-line bg-card p-4 shadow-archive">
        <h2 className="text-lg font-semibold text-ink">导入批次历史</h2>
        <div className="mt-4 grid gap-3">
          {importBatches.map((batch) => (
            <div key={batch.id} className="rounded border border-line bg-paper p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-medium text-ink">{batch.fileName}</div>
                <span className="rounded border border-line bg-card px-2 py-1 text-xs text-muted">{batch.status}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">类型：{batch.importType} · 实体：{batch.entityType} · 成功 {batch.successRows} / 失败 {batch.failedRows}</p>
              <p className="mt-1 text-xs leading-5 text-muted">报告：{batch.resultFilePath}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded border border-line bg-panel p-4 text-card">
        <h2 className="text-lg font-semibold">错误报告示例</h2>
        <pre className="mt-3 overflow-auto rounded bg-[#0f0d0b] p-3 text-xs leading-5 text-card/80">{`{
  "errors": ["证据 ev-demo-002 为 D 级，只能标为“仅作为线索”"],
  "warnings": ["证据 ev-demo-001 缺少正式 citation"]
}`}</pre>
      </section>
    </div>
  );
}
