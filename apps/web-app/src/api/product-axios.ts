import { createApiClient } from "./api-client";

const productAxios = createApiClient(import.meta.env.VITE_API_URL);

export default productAxios;


/* PRODUCT APIs */

export const createProduct = (data: {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
}) =>
  productAxios.post("/products", data);

export const getProducts = () =>
  productAxios.get("/products");

export const updateProduct = (
  id: string,
  data: Partial<{
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
  }>
) =>
  productAxios.patch(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  productAxios.delete(`/products/${id}`);


/* ORDER APIs */

export const createOrder = (data: {
  customerName: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}) =>
  productAxios.post("/orders", data);


export const updateOrderStatus = (
  id: string,
  status: string
) =>
  productAxios.patch(`/orders/${id}/status`, {
    status,
  });


export const getOrders = () =>
  productAxios.get("/orders");