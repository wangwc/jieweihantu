import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";

const root = process.cwd();
const seedRoot = path.join(root, "data-seed");

function readJson<T>(relativePath: string, fallback: T): T {
  const filePath = path.join(seedRoot, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function countRows(fileName: string) {
  return readJson<unknown[]>(`normalized/${fileName}`, []).length;
}

function exists(relativePath: string) {
  return fs.existsSync(path.join(seedRoot, relativePath));
}

function countCsvRows(relativePath: string) {
  const filePath = path.join(seedRoot, relativePath);
  if (!fs.existsSync(filePath)) return 0;
  return fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter((line) => line.trim()).length - 1;
}

export default function SeedCenterPage() {
  const buildReport = readJson<any>("reports/seed-build-report.json", {});
  const validationReport = readJson<any>("reports/validation-report.json", {});
  const missingData = readJson<any[]>("reports/missing-data-report.json", []);
  const rankings = readJson<any>("reports/seed-rankings-report.json", {});
  const controversialCount = countCsvRows("raw/controversial/controversial-claims.seed.csv");
  const historicalPageCount = countCsvRows("raw/historical-text/historical-text.page-list.csv");
  const normalizedCounts = [
    ["来源", countRows("sources.json")],
    ["人物", countRows("persons.json")],
    ["疆域", countRows("territory.json")],
    ["文物", countRows("artifacts.json")],
    ["史料片段", countRows("text_chunks.json")],
    ["线索", countRows("leads.json")],
    ["争议主张", countRows("claims.json")],
    ["证据候选", countRows("evidence_candidates.json")]
  ];

  return (
    <div className="space-y-5">
      <DemoBanner />
      <section className="rounded border border-line bg-card p-5 shadow-archive">
        <div className="text-xs uppercase tracking-[0.24em] text-muted">Seed Database Builder</div>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">Seed 中心</h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
          Seed Builder 用于初始化可重复、可校验、可回滚的数据入口。争议主张、TextChunk 和 EvidenceCandidate 默认只进入 pending_review，不直接成为事实结论。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded border border-line bg-card p-4">
          <div className="text-xs text-muted">争议主张 seed</div>
          <div className="mt-2 text-3xl font-semibold text-ink">{controversialCount}</div>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <div className="text-xs text-muted">历史文本 page list</div>
          <div className="mt-2 text-3xl font-semibold text-ink">{historicalPageCount}</div>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <div className="text-xs text-muted">缺失原始文件</div>
          <div className="mt-2 text-3xl font-semibold text-cinnabar">{missingData.length}</div>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <div className="text-xs text-muted">校验状态</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{validationReport.ok ? "通过" : "待处理"}</div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded border border-line bg-card p-4 shadow-archive">
          <h2 className="text-lg font-semibold text-ink">Normalized Records</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {normalizedCounts.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded bg-paper px-3 py-2 text-sm">
                <span className="text-muted">{label}</span>
                <span className="font-semibold text-ink">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded border border-line bg-card p-4 shadow-archive">
          <h2 className="text-lg font-semibold text-ink">Raw Files 状态</h2>
          <div className="mt-3 space-y-2 text-sm">
            {[
              ["争议主张 CSV", "raw/controversial/controversial-claims.seed.csv"],
              ["历史文本 page list", "raw/historical-text/historical-text.page-list.csv"],
              ["CHGIS manifest", "raw/open-data/chgis-files.manifest.csv"],
              ["CBDB manifest", "raw/open-data/cbdb-files.manifest.csv"],
              ["Museum manifest", "raw/open-data/museum-files.manifest.csv"]
            ].map(([label, file]) => (
              <div key={file} className="flex items-center justify-between rounded bg-paper px-3 py-2">
                <span className="text-muted">{label}</span>
                <span className={exists(file) ? "text-ok" : "text-cinnabar"}>{exists(file) ? "已就绪" : "缺失"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">Build 状态</h2>
          <p className="mt-2 text-sm leading-6 text-muted">最近生成：{buildReport.generatedAt || "尚未运行"}</p>
          <p className="mt-1 text-xs text-muted">默认离线；只有 `--allow-network` 才访问公开源。</p>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">Missing Data Report</h2>
          <p className="mt-2 text-sm leading-6 text-muted">缺失或跳过的远程/本地文件：{missingData.length}</p>
          <p className="mt-1 text-xs text-muted">缺失文件不会中断整条流水线，也不会生成伪数据。</p>
        </div>
        <div className="rounded border border-line bg-card p-4">
          <h2 className="text-lg font-semibold text-ink">Seed Rankings</h2>
          <p className="mt-2 text-sm leading-6 text-muted">网络争议热度：{rankings.networkHeat?.length || 0}</p>
          <p className="mt-1 text-xs text-muted">热度不等于可信度，只用于审核优先级。</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/research-task-board" className="focus-ring rounded border border-line bg-panel p-4 text-card hover:border-gold">
          <div className="text-xs text-gold">任务入口</div>
          <h2 className="mt-2 text-xl font-semibold">查看 ResearchTask</h2>
        </Link>
        <Link href="/staging-review" className="focus-ring rounded border border-line bg-panel p-4 text-card hover:border-gold">
          <div className="text-xs text-gold">审核入口</div>
          <h2 className="mt-2 text-xl font-semibold">查看 Pending Review</h2>
        </Link>
        <Link href="/import-center" className="focus-ring rounded border border-line bg-panel p-4 text-card hover:border-gold">
          <div className="text-xs text-gold">导入入口</div>
          <h2 className="mt-2 text-xl font-semibold">返回导入中心</h2>
        </Link>
      </section>
    </div>
  );
}
