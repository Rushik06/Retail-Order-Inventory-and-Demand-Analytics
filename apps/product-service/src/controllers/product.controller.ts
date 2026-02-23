/*eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from "express";
import * as service from "../services/product.service.js";


const getIdParam = (req: Request): string => {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
        throw new Error("Invalid product ID");
    }
    return id;

};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await service.createProduct(req.body);
        return res.status(201).json(product);

    } catch (error: any) {
        return res.status(400).json({
            message: error.message || "Failed to create product",

        });
    }
};

export const getProducts = async (_req: Request, res: Response) => {

    try {
        const products = await service.getProducts();
        return res.json(products);

    } catch (error: any) {
        return res.status(500).json({
            message: error.message || "Failed to fetch products",

        });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = getIdParam(req);
        const product = await service.getProductById(id);
        return res.json(product);

    } catch (error: any) {
        return res.status(404).json({
            message: error.message || "Product not found",

        });
    }

};


export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = getIdParam(req);
        const updatedProduct = await service.updateProduct(id, req.body);
        return res.json(updatedProduct);

    } catch (error: any) {
        return res.status(404).json({
            message: error.message || "Failed to update product",

        });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = getIdParam(req);
        await service.deleteProduct(id);
        return res.json({
            message: "Product deleted successfully",
        });

    } catch (error: any) {
        return res.status(404).json({
            message: error.message || "Failed to delete product",
        });
    }
};