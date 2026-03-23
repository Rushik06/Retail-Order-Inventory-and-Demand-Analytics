export default function DashboardSkeleton() {

  return (

    <div className="max-w-[1400px] mx-auto px-6 space-y-10 animate-pulse">

      {/* Header */}

      <div className="h-10 w-64 bg-slate-200 rounded"></div>

      {/* Counters */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {[...Array(4)].map((_, i) => (

          <div
            key={i}
            className="h-24 bg-slate-200 rounded-lg"
          />

        ))}

      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="h-[340px] bg-slate-200 rounded-lg"></div>
        <div className="h-[340px] bg-slate-200 rounded-lg"></div>

      </div>

      {/* Tables */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="h-[320px] bg-slate-200 rounded-lg"></div>
        <div className="h-[320px] bg-slate-200 rounded-lg"></div>

      </div>

    </div>

  );

}