import type { Request, Response } from "express";
import * as service from "../services/product.service.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.schema.js";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {

  const parsed = createProductSchema.safeParse({
    body: req.body,
  });

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message || "Validation error",
    });
  }

  const product = await service.createProduct(parsed.data.body);

  return res.status(201).json(product);
};

export const getProducts = async (
  _req: Request,
  res: Response
): Promise<Response> => {

  const products = await service.getProducts();
  return res.json(products);
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<Response> => {

  const id = req.params.id as string;

  const product = await service.getProductById(id);

  return res.json(product);
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {

  const parsed = updateProductSchema.safeParse({
    params: req.params,
    body: req.body,
  });

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message || "Validation error",
    });
  }

  const { id } = parsed.data.params;

  const product = await service.updateProduct(id, parsed.data.body);

  return res.json(product);
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {

  const id = req.params.id as string;

  await service.deleteProduct(id);

  return res.json({
    message: "Product deleted successfully",
  });
};