import { randomUUID } from "crypto";
import { Product } from "../models/product.model.js";
import type { CreateProductInput } from "../types/product.types.js";
import type { UpdateProductInput } from "../types/product.types.js";


/*  CREATE */
export const createProduct = async (
  data: CreateProductInput
) => {
  // Count existing products
  const count = await Product.count();

  // Generate category prefix
  const prefix = data.category
    ? data.category.slice(0, 4).toUpperCase()
    : "PROD";

  // Generate SKU
  const sku = `${prefix}-${String(count + 1).padStart(5, "0")}`;

  return Product.create({
    id: randomUUID(),
    ...data,
    sku,
  });
};

/*  GET ALL */

export const getProducts = async () => {
  return Product.findAll({
    order: [["createdAt", "DESC"]],
  });
};

/*  UPDATE */

export const updateProduct = async (
  id: string,
  data: UpdateProductInput
) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  // SKU 
  return product.update(data);
};

/* DELETE  */

export const deleteProduct = async (id: string) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  return product.destroy();
};

/*GET BY ID  */

export const getProductById = async (id: string) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  return product;
};