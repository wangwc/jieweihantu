import Link from "next/link";
import { navItems } from "@/lib/constants";

const zhNav: Record<string, string> = {
  Dashboard: "首页工作台",
  Claims: "清修叙事对照",
  Evidence: "证据库",
  "Data Import": "数据导入",
  "Review Workbench": "审核工作台",
  Rankings: "排行榜",
  "Source Registry": "来源登记册",
  "Audit Trail": "审核轨迹",
  Emperors: "皇帝重估",
  Territory: "疆域地图",
  Leads: "网络线索池",
  Sources: "来源管理",
  Methodology: "方法论",
  "Source Policy": "来源政策",
  "Data Workflow": "数据工作流"
};

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-card/95 p-5 lg:block">
        <Link href="/" className="block">
          <div className="font-serif text-2xl font-semibold text-ink">大明辨证录</div>
          <div className="mt-1 text-xs uppercase tracking-[0.22em] text-muted">Ming Evidence Atlas</div>
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="focus-ring block rounded px-3 py-2 text-sm text-muted hover:bg-paper hover:text-ink">
              {zhNav[item.label] ?? item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded border border-line bg-paper p-3 text-xs leading-5 text-muted">
          清修叙事为待核验对象；网络与短视频仅作为线索。
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-medium text-ink">多源证据校验平台</div>
              <div className="text-xs text-muted">证据优先、来源优先、可追溯优先</div>
            </div>
            <label className="w-full max-w-md">
              <span className="sr-only">全局检索</span>
              <input className="focus-ring w-full rounded border border-line bg-card px-3 py-2 text-sm" placeholder="检索主张、证据、来源、线索" />
            </label>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
