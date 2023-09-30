import express from "express";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./util.js";
import { Server, Socket } from "socket.io";
const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  //console.log(`Escuchando al puerto ${PORT}`);
});

//Websocket - server
const socketServer = new Server(httpServer);

// connetction - dosconnect
const names = [];
const messages = [];

/* socketServer.on("connection", (socket) => {
  //console.log(`Cliente conectado ${socket.id}`);
  socket.on("disconnect", () => {
    //console.log(`Cliente desconectado ${socket.id}`);
  });

  socket.on("firstEvent", (info) => {
    names.push(info);
    //console.log(`Array: ${names}`);
    //socket.emit("secondEvent", names); //Mensaje directo al cliente
    //socketServer.emit("secondEvent", names); //Emito un evento a todos los clientes conectados
    //socket.broadcast.emit("secondEvent", names); //Evento a todos los clientes a excepcion del cliente directo
  });
}); */

socketServer.on("connection", (socket) => {
  socket.on("newUser", (user) => {
    socket.broadcast.emit("newUserBroadcast", user);
  });

  socket.on("message", (info) => {
    messages.push(info);
    socketServer.emit("chat", messages);
  });
});
