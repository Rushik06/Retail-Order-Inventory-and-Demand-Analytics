import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  createOrder,
  updateOrderStatus,
} from "../api/product-axios";


// PRODUCT LOGIC         
export const createNewProduct = async (
  name: string,
  sku: string,
  category: string,
  price: number,
  stock: number
) => {
  const res = await createProduct({
    name,
    sku,
    category,
    price,
    stock,
  });

  return res.data;
};

export const fetchProducts = async () => {
  const res = await getProducts();
  return res.data;
};

export const updateExistingProduct = async (
  id: string,
  data: Partial<{
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
  }>
) => {
  const res = await updateProduct(id, data);
  return res.data;
};

export const removeProduct = async (id: string) => {
  const res = await deleteProduct(id);
  return res.data;
};


//  ORDER LOGIC        

export const createNewOrder = async (
  customerName: string,
  items: { productId: string; quantity: number }[]
) => {
  const res = await createOrder({
    customerName,
    items,
  });

  return res.data;
};

export const changeOrderStatus = async (
  id: string,
  status: string
) => {
  const res = await updateOrderStatus(id, status);
  return res.data;
};