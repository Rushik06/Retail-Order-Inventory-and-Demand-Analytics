import { z } from "zod";

export const addStockSchema = z.object({
  productId: z
    .string({ message: "Product ID is required" })
    .uuid({ message: "Product ID must be a valid UUID" }),

  warehouseId: z
    .string({ message: "Warehouse ID is required" })
    .uuid({ message: "Warehouse ID must be a valid UUID" }),

  quantity: z
    .number({ message: "Quantity is required" })
    .int()
    .positive(),

  referenceId: z
    .string()
    .uuid({ message: "Reference ID must be a valid UUID" })
    .optional(),
});

export const deductStockSchema = z.object({
  productId: z
    .string({ message: "Product ID is required" })
    .uuid({ message: "Product ID must be a valid UUID" }),

  warehouseId: z
    .string({ message: "Warehouse ID is required" })
    .uuid({ message: "Warehouse ID must be a valid UUID" }),

  quantity: z
    .number({ message: "Quantity is required" })
    .int()
    .positive(),

  referenceId: z
    .string({ message: "Reference ID is required" })
    .uuid({ message: "Reference ID must be a valid UUID" }),
});