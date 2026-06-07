export function EmptyState({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded border border-dashed border-line bg-card p-8 text-center">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{note}</p>
    </div>
  );
}
