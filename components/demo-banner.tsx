import { demoNotice } from "@/lib/constants";

export function DemoBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "rounded border border-cinnabar/30 bg-cinnabar/10 px-3 py-2 text-xs text-cinnabar" : "rounded border border-cinnabar/30 bg-cinnabar/10 px-4 py-3 text-sm text-cinnabar"}>
      {demoNotice}
    </div>
  );
}
