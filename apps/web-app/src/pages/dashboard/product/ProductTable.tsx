/* eslint-disable */
import type { Product } from "@/types/product.types";
import ProductsTableContent from "@/components/ui/products/ProductsTable";
import { useProductsTable } from "@/hooks/Productshooks";

interface Props {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductsTable({
  products,
  loading,
  onEdit,
  onDelete,
}: Props) {

  const {
    search,
    setSearch,
    category,
    setCategory,
    entries,
    setEntries,
    sortBy,
    setSortBy,
    page,
    setPage,
    categories,
    paginated,
    totalPages,
    confirmId,
    setConfirmId,
    toast,
    setToast,
  } = useProductsTable(products);

  const handleEdit = (product: Product) => {
    onEdit(product);
    setTimeout(() => {
      document
        .getElementById("product-form")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmId) return;
    await onDelete(confirmId);
    setConfirmId(null);
    setToast("Product deleted successfully");
    setTimeout(() => setToast(""), 3000);
  };

  const stockColor = (stock: number) =>
    stock > 20
      ? "bg-emerald-100 text-emerald-700"
      : stock > 5
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="bg-white rounded-2xl shadow-md border flex flex-col">

      {/* Filters */}
      <div className="px-6 py-5 border-b flex flex-wrap gap-3 items-center justify-between">

        <h2 className="text-xl font-semibold">Product Inventory</h2>

        <div className="flex flex-wrap gap-3">

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-11 px-4 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="h-11 px-4 border rounded-xl text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 px-4 border rounded-xl text-sm"
          >
            <option value="">Sort</option>
            <option value="name">Name A-Z</option>
            <option value="price">Price High → Low</option>
            <option value="stock">Stock High → Low</option>
          </select>

          <select
            value={entries}
            onChange={(e) => {
              setEntries(Number(e.target.value));
              setPage(1);
            }}
            className="h-11 px-4 border rounded-xl text-sm"
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>

        </div>
      </div>

      <ProductsTableContent
        loading={loading}
        paginated={paginated}
        entries={entries}
        page={page}
        totalPages={totalPages}
        confirmId={confirmId}
        stockColor={stockColor}
        setConfirmId={setConfirmId}
        handleEdit={handleEdit}
        handleDeleteConfirm={handleDeleteConfirm}
        setPage={setPage}
        toast={toast}
        setToast={setToast}
      />
    </div>
  );
}