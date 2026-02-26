/* eslint-disable */
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/token";


 // Product & Order Service (PORT 3001)

const productAxios = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: false,
});


// Attach Access Token Automatically
 
productAxios.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

productAxios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Call Auth Service (PORT 3000) for refresh
        const res = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          { refreshToken }
        );

        setTokens(res.data.accessToken, refreshToken);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return productAxios(originalRequest);

      } catch {
        clearTokens();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default productAxios;


//PRODUCT APIs
export const createProduct = (data: {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
}) => productAxios.post("/products", data);

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
) => productAxios.patch(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  productAxios.delete(`/products/${id}`);


// ORDER APIs          

export const createOrder = (data: {
  customerName: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}) => productAxios.post("/orders", data);

export const updateOrderStatus = (
  id: string,
  status: string
) =>
  productAxios.patch(`/orders/${id}/status`, {
    status,
  });