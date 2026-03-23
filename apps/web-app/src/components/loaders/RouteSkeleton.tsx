export default function RouteSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">

      <div className="h-8 w-56 bg-slate-200 rounded" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-slate-200 rounded-lg"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-200 rounded-lg" />
        <div className="h-64 bg-slate-200 rounded-lg" />
      </div>

    </div>
  );
}