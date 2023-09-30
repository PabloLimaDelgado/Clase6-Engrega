import { Router } from "express";
import { ProductManager } from "../public/js/productManager.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    let products = await ProductManager.getProducts();
    if (req.query.limit && !isNaN(Number(req.query.limit))) {
      const limit = Number(req.query.limit);
      products = products.slice(0, limit);
    }
    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const product = await ProductManager.getProductById(pid);

    if (product === null) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json({ data: product });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category
  ) {
    return res.status(400).json({ message: "Some data is missing" });
  }

  try {
    const newProduct = await ProductManager.createProduct(req.body);
    res.status(200).json({ message: "Product create", user: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  try {
    const response = await ProductManager.updateProduct(pid, req.body);
    if (response === -1) {
      res.status(400).json({ message: "Product not found with de id sent" });
    } else {
      res.status(200).json({ message: "Product update" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  try {
    const response = await ProductManager.deleteProduct(pid);
    if (response === -1) {
      res.status(400).json({ message: "Product not found with de id sent" });
    } else {
      res.status(200).json({ message: "Product delete" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
