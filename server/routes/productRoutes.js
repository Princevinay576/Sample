import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { authenticateAdmin } from "../utils/adminAuth.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const products = await Product.find()
      .sort({ productId: 1 })
      .select("productId name price imageKey imageUrl")
      .lean();

    res.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { productId, name, price, imageKey, imageUrl } = req.body;

    if (
      !Number.isInteger(productId) ||
      !name ||
      typeof name !== "string" ||
      Number.isNaN(Number(price))
    ) {
      return res.status(400).json({ message: "Invalid product payload" });
    }

    const normalizedImageKey = imageKey ? String(imageKey).trim() : "";
    const normalizedImageUrl = imageUrl ? String(imageUrl).trim() : "";

    if (!normalizedImageKey && !normalizedImageUrl) {
      return res.status(400).json({ message: "Provide image key or image URL." });
    }

    const product = await Product.create({
      productId,
      name: name.trim(),
      price: Number(price),
      imageKey: normalizedImageKey || undefined,
      imageUrl: normalizedImageUrl || undefined,
    });

    return res.status(201).json(product);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "productId already exists" });
    }
    console.error("Failed to create product:", error);
    return res.status(500).json({ message: "Failed to create product" });
  }
});

router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, name, price, imageKey, imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const updates = {};

    if (productId !== undefined) {
      if (!Number.isInteger(productId)) {
        return res.status(400).json({ message: "Invalid productId" });
      }
      updates.productId = productId;
    }

    if (name !== undefined) {
      if (!name || typeof name !== "string") {
        return res.status(400).json({ message: "Invalid name" });
      }
      updates.name = name.trim();
    }

    if (price !== undefined) {
      if (Number.isNaN(Number(price))) {
        return res.status(400).json({ message: "Invalid price" });
      }
      updates.price = Number(price);
    }

    if (imageKey !== undefined) {
      updates.imageKey = imageKey ? String(imageKey).trim() : undefined;
    }

    if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl ? String(imageUrl).trim() : undefined;
    }

    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    const nextImageKey = updates.imageKey !== undefined ? updates.imageKey : existing.imageKey;
    const nextImageUrl = updates.imageUrl !== undefined ? updates.imageUrl : existing.imageUrl;
    if (!nextImageKey && !nextImageUrl) {
      return res.status(400).json({ message: "Provide image key or image URL." });
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json(product);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "productId already exists" });
    }
    console.error("Failed to update product:", error);
    return res.status(500).json({ message: "Failed to update product" });
  }
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete product:", error);
    return res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;
