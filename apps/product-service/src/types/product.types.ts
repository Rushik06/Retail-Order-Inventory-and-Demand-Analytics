

/* Product Creation Type */
export interface CreateProductInput {
  name: string;
  category: string;
  price: number;
  stock: number;
}

/* Update Type */
export interface UpdateProductInput {
  name?: string|undefined;
  category?: string|undefined;
  price?: number|undefined;
  stock?: number|undefined;
}
