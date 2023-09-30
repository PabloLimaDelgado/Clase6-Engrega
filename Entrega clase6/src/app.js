import express from "express";
import handlebars from "express-handlebars";
import viewsSocket from "./routes/viewSocket.router.js";
import views from "./routes/view.router.js";
import viewsHome from "./routes/viewsHome.router.js";
import { __dirname } from "./util.js";
import { Server, Socket } from "socket.io";
import { ProductManager } from "../src/public/js/productManager.js";
const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/", views);
app.use("/", viewsHome);
app.use("/realtimeproducts", viewsSocket);

const httpServer = app.listen(PORT, () => {
  //console.log(`Escuchando al puerto ${PORT}`);
});

//Websocket - server
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  socket.on("agregoProducto", async (product) => {
    try {
      await ProductManager.createProduct(product);
      console.log("Product added successfully");
      socket.emit("mostrarTodosProductosCliente", product);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  });

  socket.on("mostrarTodosProductos", async (product) => {
    try {
      console.log("Estoy en Mostrar");
      //await ProductManager.createProduct(product);

      const allProducts = await ProductManager.getProducts();

      socket.emit("all-products", allProducts);
    } catch (error) {}
  });
});
