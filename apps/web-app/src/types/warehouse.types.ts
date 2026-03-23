export type Warehouse = {
  warehouse_id: string;
  name: string;
  location: string;
  is_active: boolean;
};

export type WarehouseTableProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  sortField: "name" | "location";
  setSortField: React.Dispatch<React.SetStateAction<"name" | "location">>;

  sortOrder: "ASC" | "DESC";
  setSortOrder: React.Dispatch<React.SetStateAction<"ASC" | "DESC">>;

  warehouses: Warehouse[];

  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;

  handleView: (id: string) => void;
  handleDeactivate: (id: string) => void;
  handleActivate: (id: string) => void;
}