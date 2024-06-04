import express from "express";
import { engine } from "express-handlebars";
import __dirname from "./path.js";

import { Server } from "socket.io";

import products from "./routes/products.routes.js";
import carts from "./routes/carts.routes.js";
import views from "./routes/views.routes.js";

import ProductManager from "./managers/products.manager.js";
const productManager = new ProductManager(`${__dirname}/database/products.json`);

//funcion para socket.io

const PORT = 8080;
const app = express();

//configuro express

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//configuro handlebars

app.engine("handlebars", engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//rutas

app.use("/api/products", products);
app.use("/api/carts", carts);
app.use("/api/views", views);

const server = app.listen(PORT, () => {
   console.log(`el puerto:${PORT} funciona correctamente`);
});

const io = new Server(server);

const gestorProducts = async data => {
   try {
      await productManager.newProduct(data);
      const allProducts = await productManager.getProducts();
      return allProducts;
   } catch {}
};

io.on("connection", socket => {
   socket.on("newProduct", async data => {
      try {
         const allProducts = await gestorProducts(data);
         io.emit("products", allProducts);
      } catch {}
   });
});
