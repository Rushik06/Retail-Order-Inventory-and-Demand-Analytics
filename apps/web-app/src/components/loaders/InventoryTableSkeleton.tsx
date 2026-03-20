export default function InventoryTableSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded w-[200px]" />
          </td>

          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded w-[200px]" />
          </td>

          <td className="p-4 text-center">
            <div className="h-4 bg-gray-200 rounded w-[40px] mx-auto" />
          </td>

          <td className="p-4 text-center">
            <div className="h-4 bg-gray-200 rounded w-[40px] mx-auto" />
          </td>

          <td className="p-4 text-center">
            <div className="h-4 bg-gray-200 rounded w-[60px] mx-auto" />
          </td>

          <td className="p-4 text-center">
            <div className="h-4 bg-gray-200 rounded w-[20px] mx-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}