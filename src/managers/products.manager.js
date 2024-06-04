import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export default class ProductManager {
   constructor(path) {
      this.path = path;
   }
   async getProducts(limit) {
      try {
         if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf8");
            if (!data) return [];
            const products = JSON.parse(data);
            if (limit) return products.slice(0, limit);
            return products;
         } else {
            return [];
         }
      } catch (error) {
         console.error(error);
      }
   }

   async getProductById(id) {
      try {
         const products = await this.getProducts();
         const obtainedProduct = products.find(p => p.id === id);
         if (!obtainedProduct) throw new Error("Product not found");
         return obtainedProduct;
      } catch (error) {
         console.error(error);
      }
   }

   async newProduct(product) {
      try {
         const products = await this.getProducts();
         const newProduct = {
            id: uuidv4(),
            status: true,
            quantity: 1,
            thumbnails: [],
            ...product,
         };
         products.push(newProduct);
         await fs.promises.writeFile(this.path, JSON.stringify(products));
         return newProduct;
      } catch (error) {
         console.error(error);
      }
   }

   async updateProduct(id, updates) {
      try {
         const products = await this.getProducts();
         const obtainedProduct = await this.getProductById(id);
         if (!obtainedProduct) throw new Error("Product not found");
         const udpatedProduct = {
            ...obtainedProduct,
            ...updates,
            id: obtainedProduct.id,
            quantity: 1,
         };
         const newArray = products.filter(p => p.id !== id);
         newArray.push(udpatedProduct);
         await fs.promises.writeFile(this.path, JSON.stringify(newArray));
         return udpatedProduct;
      } catch (error) {
         console.error(error);
      }
   }

   async deleteProduct(id) {
      try {
         const products = await this.getProducts();
         if (products.length > 0) {
            const productExist = await this.getProductById(id);
            if (!productExist) throw new Error("no existe el producto");
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
               products.splice(index, 1);
               await fs.promises.writeFile(this.path, JSON.stringify(products));
               return true;
            } else {
               return false;
            }
         } else {
            throw new Error("No existen productos para eliminar.");
         }
      } catch (error) {
         console.error(error);
      }
   }
}
