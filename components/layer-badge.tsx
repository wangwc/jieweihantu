import { layerMeta } from "@/lib/constants";
import type { SourceLayer } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LayerBadge({ layer, withNote = false }: { layer: SourceLayer; withNote?: boolean }) {
  const meta = layerMeta[layer];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium", meta.className)} title={meta.note}>
      <span>{layer}</span>
      <span>{withNote ? meta.note : meta.title.replace(`${layer} `, "")}</span>
    </span>
  );
}
