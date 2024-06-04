import express from "express";
import ProductManager from "../managers/products.manager.js";
import __dirname from "../path.js";

const routes = express.Router();
const productManager = new ProductManager(`${__dirname}/database/products.json`);

routes.get("/", async (req, res) => {
   try {
      const products = await productManager.getProducts();
      res.render("home", { products });
   } catch {}
});

routes.get("/realtimeproducts", (req, res) => {
   res.render("realtimeproducts");
});

export default routes;
