import { z } from "zod";

export const reserveStockSchema = z.object({
  productId: z
    .number({message: "Product ID is required" })
    .int()
    .positive(),

  warehouseId: z
    .number({ message: "Warehouse ID is required" })
    .int()
    .positive(),

  quantity: z
    .number({ message: "Quantity is required" })
    .int()
    .positive(),
});

export const releaseStockSchema = z.object({
  productId: z
    .number()
    .int()
    .positive(),

  warehouseId: z
    .number()
    .int()
    .positive(),

  quantity: z
    .number()
    .int()
    .positive(),
});