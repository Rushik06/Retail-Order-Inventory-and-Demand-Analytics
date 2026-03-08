/*eslint-disable */
export type Props = {
inventory: any[];
products: any[];
warehouses: any[];
loading: boolean;
reload: () => void;
addInventoryStock: any;
reserveInventoryStock: any;
releaseInventoryStock: any;
deductInventoryStock: any;
onSort?: (field: string) => void;
search: string;
setSearch: (value: string) => void;
limit: number;
setLimit: (value: number) => void;
page: number;
setPage: any;
totalPages: number;
}


