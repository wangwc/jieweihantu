import { DemoBanner } from "@/components/demo-banner";
import { evidenceTasks } from "@/lib/data";

export default function ResearchTaskBoardPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <h1 className="font-serif text-3xl font-semibold text-ink">研究任务板</h1>
        <p className="mt-3 text-sm leading-7 text-muted">展示系统自动生成的待补资料任务：缺少哪类证据、推荐查找方向、优先级、状态和备注。</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {evidenceTasks.map((task) => (
          <article key={task.id} className="rounded border border-line bg-card p-4 shadow-archive">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-ink">{task.title}</h2>
              <span className="rounded border border-line bg-paper px-2 py-1 text-xs text-muted">{task.priority}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{task.description}</p>
            <p className="mt-2 text-xs text-cinnabar">状态：{task.status} · 需要来源：{task.requiredSourceLayers.join("/")}</p>
            <p className="mt-2 text-xs text-muted">备注：{task.dueNote}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
