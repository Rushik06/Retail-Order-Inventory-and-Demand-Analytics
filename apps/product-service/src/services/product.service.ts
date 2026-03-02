import { randomUUID } from "crypto";
import { Product } from "../models/product.model.js";
import { Op } from "sequelize";
import type { CreateProductInput } from "../types/product.types.js";
import type { UpdateProductInput } from "../types/product.types.js";


/* CREATE */
export const createProduct = async (
  data: CreateProductInput
) => {
  const count = await Product.count();

  const prefix = data.category
    ? data.category.slice(0, 4).toUpperCase()
    : "PROD";

  const sku = `${prefix}-${String(count + 1).padStart(5, "0")}`;

  return Product.create({
    id: randomUUID(),
    ...data,
    sku,
  });
};


/* GET ALL */
export const getProducts = async ({
  page = 1,
  limit = 6,
  search = "",
  category = "",
  sort = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}) => {

  const offset = (page - 1) * limit;

/*eslint-disable @typescript-eslint/no-explicit-any */
  const where: any = {};

  // Search (name or sku)
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { sku: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Category filter
  if (category) {
    where.category = category;
  }

  // Sorting
  let order: any = [["createdAt", "DESC"]];

  switch (sort) {
    case "name":
      order = [["name", "ASC"]];
      break;
    case "price_desc":
      order = [["price", "DESC"]];
      break;
    case "price_asc":
      order = [["price", "ASC"]];
      break;
    case "stock_desc":
      order = [["stock", "DESC"]];
      break;
    case "stock_asc":
      order = [["stock", "ASC"]];
      break;
  }

  const { rows, count } = await Product.findAndCountAll({
    where,
    order,
    limit,
    offset,
  });

  return {
    data: rows,
    total: count,
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
};


/* UPDATE */
export const updateProduct = async (
  id: string,
  data: UpdateProductInput
) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  return product.update(data);
};


/* DELETE */
export const deleteProduct = async (id: string) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  return product.destroy();
};


/* GET BY ID */
export const getProductById = async (id: string) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  return product;
};