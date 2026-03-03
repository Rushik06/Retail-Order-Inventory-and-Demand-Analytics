import { z } from "zod";

export const addStockSchema = z.object({
  productId: z
    .number({ message: "Product ID is required" })
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

  referenceId: z
    .number()
    .int()
    .positive()
    .optional(),
});

export const deductStockSchema = z.object({
  productId: z
    .number({ message: "Product ID is required" })
    .int()
    .positive(),

  warehouseId: z
    .number({message: "Warehouse ID is required" })
    .int()
    .positive(),

  quantity: z
    .number({ message: "Quantity is required" })
    .int()
    .positive(),

  referenceId: z
    .number({ message: "Reference ID is required" })
    .int()
    .positive(),
});