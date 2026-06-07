import { EvidenceCard } from "@/components/evidence-card";
import { relationGroups } from "@/lib/constants";
import type { EvidenceItem } from "@/lib/types";

export function EvidenceChain({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <div className="space-y-4">
      {relationGroups.map((relation) => {
        const items = evidence.filter((item) => item.relationToClaim === relation);
        if (!items.length) return null;
        return (
          <section key={relation} className="rounded border border-line bg-paper p-3">
            <h3 className="mb-3 text-sm font-semibold text-ink">{relation}</h3>
            <div className="space-y-3">
              {items.map((item) => <EvidenceCard key={item.id} item={item} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
