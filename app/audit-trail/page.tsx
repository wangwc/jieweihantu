import { DemoBanner } from "@/components/demo-banner";
import { auditRecords } from "@/lib/data";

export default function AuditTrailPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">审核轨迹</h1>
        <p className="mt-3 text-sm leading-7 text-muted">记录人工审核、导入更新、驳回、归档和恢复动作，确保资料变化可审计。</p>
      </section>
      <div className="grid gap-4">
        {auditRecords.map((record) => (
          <article key={record.id} className="rounded border border-line bg-card p-4 shadow-archive">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">{record.entityType} · {record.entityId}</h2>
                <p className="mt-1 text-xs text-muted">{record.action} · {record.reviewer} · {record.createdAt}</p>
              </div>
              {record.demoOnly ? <span className="rounded border border-cinnabar/30 bg-cinnabar/10 px-2 py-1 text-xs text-cinnabar">示例</span> : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{record.note}</p>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <pre className="overflow-auto rounded bg-paper p-3 text-xs text-muted">{JSON.stringify(record.before, null, 2)}</pre>
              <pre className="overflow-auto rounded bg-paper p-3 text-xs text-muted">{JSON.stringify(record.after, null, 2)}</pre>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
