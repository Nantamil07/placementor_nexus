export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
        <div className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900" />
      </div>
    </div>
  );
}
