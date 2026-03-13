import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product } from "@/types/product.types";

export function useProductsTable(products: Product[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [entries, setEntries] = useState(
    Number(searchParams.get("entries")) || 6
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  /* Sync URL */
  useEffect(() => {
    setSearchParams({
      search,
      category,
      entries: String(entries),
      sort: sortBy,
      page: String(page),
    });
  }, [search, category, entries, sortBy, page]);

  /* Debounced search */
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  /* Categories */
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  /* Filter */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchCategory = category ? p.category === category : true;

      return matchSearch && matchCategory;
    });
  }, [products, debouncedSearch, category]);

  /* Sorting */
  const sorted = useMemo(() => {
    const copy = [...filtered];

    switch (sortBy) {
      case "name":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "price":
        return copy.sort((a, b) => b.price - a.price);
      case "stock":
        return copy.sort((a, b) => b.stock - a.stock);
      default:
        return copy;
    }
  }, [filtered, sortBy]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(sorted.length / entries));

  const paginated = sorted.slice(
    (page - 1) * entries,
    page * entries
  );

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  return {
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
  };
}