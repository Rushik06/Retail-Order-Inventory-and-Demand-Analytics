export default function WarehouseTableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse">

          <td className="p-4">
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
          </td>

          <td className="p-4">
            <div className="h-4 w-28 bg-slate-200 rounded"></div>
          </td>

          <td className="p-4">
            <div className="h-4 w-16 bg-slate-200 rounded"></div>
          </td>

          <td className="p-4">

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-slate-200 rounded"></div>
              <div className="h-9 w-9 bg-slate-200 rounded"></div>
            </div>

          </td>

        </tr>
      ))}
    </>
  );
}