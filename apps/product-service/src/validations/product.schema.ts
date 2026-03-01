import { z } from "zod";

/* CREATE */

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .trim(),

    category: z
      .string()
      .min(2, "Category is required")
      .trim(),

    price: z.coerce
      .number()
      .positive("Price must be positive"),

    stock: z.coerce
      .number()
      .int("Stock must be whole number")
      .nonnegative("Stock cannot be negative"),
  }),
});

/* UPDATE */

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),

  body: z.object({
    name: z.string().min(3).trim().optional(),

    category: z.string().min(2).trim().optional(),

    price: z.coerce
      .number()
      .positive()
      .optional(),

    stock: z.coerce
      .number()
      .int()
      .nonnegative()
      .optional(),
  }),
});