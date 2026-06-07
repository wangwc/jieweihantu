import type { SourceLayer } from "@/lib/types";

export const layerMeta: Record<SourceLayer, { title: string; note: string; className: string }> = {
  S: {
    title: "S 明代同时期原始材料",
    note: "高优先级事实校验材料",
    className: "border-ok/30 bg-ok/10 text-ok"
  },
  A: {
    title: "A 实物证据",
    note: "舆图、器物、建筑、档案等",
    className: "border-teal/30 bg-teal/10 text-teal"
  },
  B: {
    title: "B 非清代外部记录",
    note: "海外、周边政权或商旅记录",
    className: "border-gold/40 bg-gold/10 text-[#74551e]"
  },
  C: {
    title: "C 现代学术研究",
    note: "论文、专著、数据库、考古报告",
    className: "border-muted/30 bg-muted/10 text-muted"
  },
  D: {
    title: "D 网络文章/视频线索",
    note: "仅作待核验线索，不能直接作为结论",
    className: "border-danger/30 bg-danger/10 text-danger"
  },
  Q: {
    title: "Q 清修叙事",
    note: "待核验对象，不作为事实依据",
    className: "border-cinnabar/40 bg-cinnabar/10 text-cinnabar"
  },
  X: {
    title: "X 无法核验资料",
    note: "风险资料，仅暂存或排除",
    className: "border-danger bg-danger/15 text-danger"
  }
};

export const demoNotice = "示例数据，仅用于产品结构演示，不代表最终历史结论。";

export const relationGroups = ["反驳清修叙事", "支持清修叙事", "部分支持", "部分反驳", "提供背景", "仅作为线索"] as const;

export const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/claims", label: "Claims" },
  { href: "/evidence", label: "Evidence" },
  { href: "/data-import", label: "Data Import" },
  { href: "/review", label: "Review Workbench" },
  { href: "/rankings", label: "Rankings" },
  { href: "/source-registry", label: "Source Registry" },
  { href: "/audit-trail", label: "Audit Trail" },
  { href: "/emperors", label: "Emperors" },
  { href: "/territory", label: "Territory" },
  { href: "/leads", label: "Leads" },
  { href: "/sources", label: "Sources" },
  { href: "/methodology", label: "Methodology" },
  { href: "/source-policy", label: "Source Policy" },
  { href: "/data-workflow", label: "Data Workflow" }
];
