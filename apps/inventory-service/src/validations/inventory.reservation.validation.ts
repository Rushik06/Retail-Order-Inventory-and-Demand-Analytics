import { z } from "zod";

export const reserveStockSchema = z.object({
  productId: z.string().uuid({
    message: "Product ID must be a valid UUID",
  }),
  warehouseId: z.string().uuid({
    message: "Warehouse ID must be a valid UUID",
  }),
  quantity: z.number().int().positive({
    message: "Quantity must be positive",
  }),
});
export const releaseStockSchema = z.object({
  productId: z.string().uuid({
    message: "Product ID must be a valid UUID",
  }),
  warehouseId: z.string().uuid({
    message: "Warehouse ID must be a valid UUID",
  }),
  quantity: z.number().int().positive({
    message: "Quantity must be positive",
  }),
});