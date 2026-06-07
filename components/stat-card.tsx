export function StatCard({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <div className="rounded border border-line bg-card p-4 shadow-archive">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-ink">{value}</div>
      <div className="mt-2 text-xs leading-5 text-muted">{note}</div>
    </div>
  );
}
