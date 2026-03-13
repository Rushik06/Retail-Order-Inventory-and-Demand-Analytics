import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z
      .string()
      .min(3, "Customer name required")
      .trim(),

    items: z
      .array(
        z.object({
          productId: z.string().uuid("Invalid product ID"),

          quantity: z.coerce
            .number()
            .int("Quantity must be whole number")
            .positive("Quantity must be positive"),
        })
      )
      .min(1, "Order must contain at least one item"),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid order ID"),
  }),
  body: z.object({
    status: z.enum([
      "CREATED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ]),
  }),
});