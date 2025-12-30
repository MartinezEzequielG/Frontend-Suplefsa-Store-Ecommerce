export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded bg-zinc-200" />
            <div className="mt-2 h-4 w-2/3 bg-zinc-200 rounded" />
            <div className="mt-1 h-3 w-1/2 bg-zinc-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}