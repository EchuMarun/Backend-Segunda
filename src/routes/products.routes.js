import { Router } from "express";
import ProductManager from "../managers/products.manager.js";
import __dirname from "../path.js";

const router = Router();

const productManager = new ProductManager(`${__dirname}/database/products.json`);

router.get("/", async (req, res) => {
   try {
      const { limit } = req.query;
      const products = await productManager.getProducts(Number(limit));
      res.status(200).json(products);
   } catch (error) {
      res.status(404).json({ status: "Error", message: "Error" });
   }
});

router.get("/:pid", async (req, res) => {
   try {
      const { pid } = req.params;
      const product = await productManager.getProductById(pid);
      if (!product) {
         res.status(404).json({ status: "Error", message: "El producto no existe" });
      } else {
         res.status(200).json(product);
      }
   } catch {
      res.status(404).json({ status: "Error", message: "Error" });
   }
});

router.post("/", async (req, res) => {
   try {
      const product = req.body;
      const newProduct = await productManager.newProduct(product);
      res.status(201).json({ status: "success", message: `El producto ${newProduct.title} se agrego` });
   } catch {
      res.status(404).json({ status: "Error", message: "Error" });
   }
});

router.put("/:pid", async (req, res) => {
   try {
      const { pid } = req.params;
      const product = req.body;
      const updatedProduct = await productManager.updateProduct(pid, product);
      if (!updatedProduct) {
         res.status(404).json({ status: "not Found", message: "el producto no existe" });
      }
      res.status(200).json({ updatedProduct });
   } catch {
      res.status(404).json({ status: "Error", message: "Error" });
   }
});

router.delete("/:pid", async (req, res) => {
   try {
      const { pid } = req.params;
      const deletedProduct = await productManager.deleteProduct(pid);
      if (!deletedProduct) {
         res.status(404).json({ status: "not Found", message: "el producto no existe" });
      }
      res.status(200).json({ status: "success", message: "el producto fue eliminado correctamente" });
   } catch {
      res.status(404).json({ status: "Error", message: "Error" });
   }
});

export default router;
