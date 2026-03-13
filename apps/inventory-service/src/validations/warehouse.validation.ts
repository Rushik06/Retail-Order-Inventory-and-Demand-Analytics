import { z } from "zod";

/* CREATE WAREHOUSE */

export const createWarehouseSchema = z.object({
name: z
.string()
.trim()
.min(2, "Warehouse name must be at least 2 characters")
.max(100, "Warehouse name too long"),

location: z
.string()
.trim()
.min(2, "Location must be at least 2 characters")
.max(100, "Location too long"),
});

/* UPDATE WAREHOUSE */

export const updateWarehouseSchema = z.object({
name: z
.string()
.trim()
.min(2)
.max(100)
.optional(),

location: z
.string()
.trim()
.min(2)
.max(100)
.optional(),
});

/* QUERY VALIDATION */

export const warehouseQuerySchema = z.object({
page: z.string().optional(),
limit: z.string().optional(),
search: z.string().optional(),
sortField: z.enum(["name", "location", "createdAt"]).optional(),
sortOrder: z.enum(["ASC", "DESC"]).optional(),
});