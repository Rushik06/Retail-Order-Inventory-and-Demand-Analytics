/* eslint-disable */
export interface Product {
  id: string;
  name: string;
  sku: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  Product?: {
    id: string;
    name: string;
  };
}

export interface Props {
  form: any;
  setForm: any;
  products: any[];
  onCreate: () => Promise<void>;
}