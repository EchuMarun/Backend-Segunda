import { Router } from "express";
import __dirname from "../path.js";
import CartManager from "../managers/cart.manager.js";

const router = Router();
const cartManager = new CartManager(`${__dirname}/database/cart.json`);

router.post("/", async (req, res) => {
   try {
      const product = req.body;
      const createdCart = await cartManager.createCart(product);
      if (!createdCart) {
         res.status(404).json({ status: "error", message: "this cart doesn't exist" });
      }
      res.status(201).json(createdCart);
   } catch {
      res.status(404).json({ status: "Error", message: "Error" });
   }
});

router.get("/:cid", async (req, res) => {
   try {
      const { cid } = req.params;
      const findedProducts = await cartManager.getProductsByIdCart(cid);
      if (!findedProducts) {
         res.status(404).json({ status: "error", message: "this cart id doesn't exist" });
      }
      res.status(200).json(findedProducts.products);
   } catch {
      res.status(404).json({ status: "Error", message: "Error" });
   }
});

router.post("/:cid/products/:pid", async (req, res) => {
   try {
      const { cid } = req.params;
      const { pid } = req.params;
      console.log(cid, pid);
      const response = await cartManager.pushProductInCart(cid, pid);
      console.log(response);
      if (!response) res.status(400).json({ status: "error", message: "this cart id doesn't exist" });
      res.status(201).json(response);
   } catch {
      res.status(404).json({ status: "Error", message: "Error" });
   }
});

export default router;
