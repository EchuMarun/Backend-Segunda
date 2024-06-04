const socket = io();
const title = document.getElementById("titleProduct");
const price = document.getElementById("priceProduct");
const description = document.getElementById("descriptionProduct");
const button = document.getElementById("buttonSubmit");
const listProducts = document.getElementById("listProducts");

button.addEventListener("click", () => {
   if (title.value && price.value && description.value !== "") {
      const newProduct = {
         title: title.value,
         price: price.value,
         description: description.value,
      };
      socket.emit("newProduct", newProduct);
   }
});

socket.on("products", products => {
   listProducts.innerHTML = "";
   products.forEach(product => {
      const producto = document.createElement("div");
      producto.innerHTML = `
        <label>${product.id}</label>
        <h2>${product.title}</h2>
        <h3>${product.description}</h3>
        <h4${product.price}></h4$>
        <p>--------------------</p>
        `;
      listProducts.append(producto);
   });
});
