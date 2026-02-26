/* eslint-disable  */
import type { Request, Response } from "express";
import * as service from "../services/product.service.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.schema.js";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const parsed = createProductSchema.safeParse({
      body: req.body,
    });

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0]!.message,
      });
    }

    const product = await service.createProduct(parsed.data.body);

    return res.status(201).json(product);
  } catch (error: unknown) {
    return res.status(500).json({ message: "Unexpected error" });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await service.getProducts();
    return res.json(products);
  } catch {
    return res.status(500).json({ message: "Unexpected error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const product = await service.getProductById(id);
    return res.json(product);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const parsed = updateProductSchema.safeParse({
      params: req.params,
      body: req.body,
    });

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0]!.message,
      });
    }

    const { id } = parsed.data.params;

    const product = await service.updateProduct(id, parsed.data.body);

    return res.json(product);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await service.deleteProduct(id);

    return res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};