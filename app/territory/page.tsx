import { DemoBanner } from "@/components/demo-banner";
import { TerritoryWorkbench } from "@/components/territory-workbench";

export default function TerritoryPage() {
  return (
    <div className="space-y-5">
      <DemoBanner />
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink">疆域证据地图</h1>
        <p className="mt-2 text-sm text-muted">第一阶段使用简化点位图，表达控制类型和证据来源，不绘制现代主权边界。</p>
      </div>
      <TerritoryWorkbench />
    </div>
  );
}
