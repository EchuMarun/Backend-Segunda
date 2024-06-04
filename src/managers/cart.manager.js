import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import ProductManager from "../managers/products.manager.js";
import __dirname from "../path.js";

const productManager = new ProductManager(`${__dirname}/db/products.json`);

export default class CartManager {
   constructor(path) {
      this.path = path;
   }
   async getAllCarts() {
      try {
         if (fs.existsSync(this.path)) {
            const carts = await fs.promises.readFile(this.path, "utf8");
            return carts;
         } else {
            return [];
         }
      } catch (error) {
         console.error(error);
      }
   }

   async createCart() {
      try {
         let carts = await this.getAllCarts();
         const newCart = {
            id: uuidv4(),
            products: [],
         };
         carts.push(newCart);
         const parsedCart = JSON.stringify(carts);
         await fs.promises.writeFile(this.path, parsedCart);
         return newCart;
      } catch (error) {
         console.error("Error creating cart:", error);
         return null;
      }
   }
   async getProductsByIdCart(id) {
      try {
         const carts = await this.getAllCarts();
         const findedCart = carts.find(c => c.id === id);
         if (!findedCart) throw new Error("Cart not found");
         return findedCart;
      } catch (error) {
         console.error("Error creating cart:", error);
      }
   }
   async pushProductInCart(cid, pid) {
      try {
         const obtainedProduct = await productManager.getProductById(pid);
         if (!obtainedProduct) throw new Error("Product not found");
         const carts = await this.getAllCarts();
         const cartExist = await this.getProductsByIdCart(cid);
         if (!cartExist) throw new Error("Cart not found");
         const productsExist = cartExist.products.find(p => p.id === pid);
         if (!productsExist) {
            const newProduct = {
               id: obtainedProduct.id,
               quantity: 1,
            };
            cartExist.products.push(newProduct);
         } else productsExist.quantity += 1;
         const updateCart = carts.map(c => {
            if (c.id === cid) return cartExist;
            return c;
         });
         await fs.promises.writeFile(this.path, JSON.stringify(updateCart));
         return cartExist;
      } catch {
         console.error("Error creating cart:", error);
      }
   }
}
