import express from "express";
import emoji from "node-emoji";
import handlebars from "express-handlebars";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

//import Contenedor from "./contenedor.js";

import path from "path";

import ContenedorDB from "./contenedorDB.js";
import { config, configSqlite3 } from "./config.js";

const __dirname = path.resolve();
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// let contenedor = new Contenedor(__dirname + "/src/productos.txt");
// let fileMessages = new Contenedor(__dirname + "/src/messages.txt");
let productsDB = new ContenedorDB(config, "products");
let messagesDB = new ContenedorDB(config, "messages");

(async function () {
  //Verifico y creo las tablas si es necesario
  await productsDB.createTables();
  await messagesDB.createTables();
})();

// (async function () {
//   const response = await productsDB.getAll();
//   console.log("resposne", response);
// })();

(async function () {
  const element = { title: "lala", price: "111", thumbnail: "asdasd" };
  //await productsDB.save(element);
})();

// (async function () {
//   const element = { title: "titulo3", price: 333, id: 3 };
//   //await productsDB.update(element);
// })();

// (async function () {
//   //const element = { title: "titulo3", price: 333, id: 3 };
//   //await productsDB.delete(1);
// })();

//iniciamos el websocket
io.on("connection", async (socket) => {
  console.log(emoji.get("pizza"), "usuario conectado");

  //const messages = await fileMessages.getAll();
  const messagesList = await messagesDB.getAll();

  socket.emit("messageBackend", messagesList);

  socket.on("disconnect", () => {
    console.log(emoji.get("fire"), "Usuario desconectado");
  });

  socket.on("messageFront", async (data) => {
    console.log("data Front", data);
    const { email, message } = data;
    const date = new Date();
    const currentDateFormat =
      date.getDate() +
      "/" +
      date.getMonth() +
      1 +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();

    const currentMessage = { email, message, date: currentDateFormat };
    await messagesDB.save(currentMessage);
    messagesList.push(currentMessage);
    io.sockets.emit("messageBackend", messagesList);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/src/views/layouts",
    partialsDir: __dirname + "/src/views/partials",
  })
);

app.use(express.static("public"));

app.set("views", "./src/views");
app.set("view engine", "hbs");

app.get("/", async (req, res) => {
  res.render("main", { viewSave: true });
});

app.get("/productos", async (req, res) => {
  //const products = await productsDB.getAll();
  const products = [];
  console.log("products", products);
  const existProducts = products.length === 0 ? false : true;
  res.render("main", { products, viewList: true, existProducts });
});

app.post("/productos", async (req, res) => {
  const { title, price, thumbnail } = req.body;
  const product = { title, price, thumbnail };

  await productsDB.save(product);

  res.redirect("/");
});

httpServer.listen(8080, () => console.log("Server started on 8080"));
