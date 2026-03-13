export interface Product {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  customer_name?: string;
  product_id?: string;
  product_name?: string;
  status: "DELIVERED" | "SHIPPED" | "PROCESSING" | "CANCELLED";
  order_date?: string;
}

export interface RecentOrdersProps {
  data: Order[];
  products: Product[];
}

export const getProductName = (
  products: Product[],
  productId?: string
): string =>
  products?.find((p) => p.id === productId)?.name || "Unknown";

export const formatOrderDate = (date?: string): string =>
  date ? new Date(date).toLocaleDateString() : "-";