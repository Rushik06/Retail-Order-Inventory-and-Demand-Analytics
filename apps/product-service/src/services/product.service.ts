/*eslint-disable @typescript-eslint/no-explicit-any */
import {Product} from "../models/product.model.js";

export const createProduct = async (data: any) => {
  return Product.create(data);
};

export const getProducts = async () => {
  return Product.findAll();
};

export const updateProduct = async (id: string, data: any) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  return product.update(data);
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  return product.destroy();
};
/*eslint-disable @typescript-eslint/no-unused-vars*/
export function getProductById(id: string | string[] | undefined) {
    throw new Error("Function not implemented.");
}
