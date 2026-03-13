/*eslint-disable */
export const filterInventory = (
  inventory: any[],
  products: any[],
  warehouses: any[],
  search: string
) => {

  if (!search) return inventory;

  const searchValue = search.toLowerCase();

  return inventory.filter((item) => {

    const product = products.find(
      (p) => p.id === item.product_id
    );

    const warehouse = warehouses.find(
      (w) => w.warehouse_id === item.warehouse_id
    );

    const productName = product?.name?.toLowerCase() || "";
    const productSku = product?.sku?.toLowerCase() || "";

    const warehouseName = warehouse?.name?.toLowerCase() || "";
    const warehouseLocation = warehouse?.location?.toLowerCase() || "";

    return (
      productName.includes(searchValue) ||
      productSku.includes(searchValue) ||
      warehouseName.includes(searchValue) ||
      warehouseLocation.includes(searchValue)
    );
  });

};

export const sortInventory = (
  inventory: any[],
  products: any[],
  warehouses: any[],
  field: string
) => {

  if (field === "product_id") {

    return [...inventory].sort((a, b) => {
      const productA =
        products.find(p => p.id === a.product_id)?.name || "";

      const productB =
        products.find(p => p.id === b.product_id)?.name || "";

      return productA.localeCompare(productB);
    });

  }

  if (field === "warehouse_id") {

    return [...inventory].sort((a, b) => {
      const warehouseA =
        warehouses.find(w => w.warehouse_id === a.warehouse_id)?.name || "";

      const warehouseB =
        warehouses.find(w => w.warehouse_id === b.warehouse_id)?.name || "";

      return warehouseA.localeCompare(warehouseB);
    });

  }

  return inventory;
};