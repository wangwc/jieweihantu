"use client";

export function FilterBar({
  search,
  onSearch,
  children
}: {
  search: string;
  onSearch: (value: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded border border-line bg-card p-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <input className="focus-ring rounded border border-line bg-paper px-3 py-2 text-sm" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="输入关键词筛选" />
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    </div>
  );
}
