import InventoryCreateCard from "./InventoryForm";
import InventoryTable from "./inventorytable/InventoryTable";
import useInventoryPageLogic from "./InventoryLogic";

export default function InventoryPage() {

  const inv = useInventoryPageLogic();

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Inventory Management
      </h1>

      <InventoryCreateCard
        products={inv.products}
        warehouses={inv.warehouses}
        productId={inv.productId}
        warehouseId={inv.warehouseId}
        setProductId={inv.setProductId}
        setWarehouseId={inv.setWarehouseId}
        onCreate={inv.createInventory}
      />

      <InventoryTable
        inventory={inv.inventory}
        products={inv.products}
        warehouses={inv.warehouses}
        loading={inv.loading}
        reload={inv.loadInventory}
        addInventoryStock={inv.safeAddInventoryStock}
        reserveInventoryStock={inv.reserveInventoryStock}
        releaseInventoryStock={inv.releaseInventoryStock}
        deductInventoryStock={inv.deductInventoryStock}
        onSort={inv.handleSort}
        search={inv.search}
        setSearch={inv.setSearch}
        limit={inv.limit}
        setLimit={(value) => {
          inv.setPage(1);
          inv.setLimit(value);
        }}
        page={inv.page}
        setPage={inv.setPage}
        totalPages={inv.totalPages}
      />

    </div>

  );

}