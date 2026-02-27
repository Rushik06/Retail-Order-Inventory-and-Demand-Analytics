/* eslint-disable */
 export type Props = {
  form: any;
  editingId: string | null;
  setForm: (data: any) => void;
  onSubmit: (e: any) => void;
};

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
}

