const express = require("express");
const emoji = require("node-emoji");
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const moduleContenedor = require("./contenedor");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let contenedor = new moduleContenedor.Contenedor(__dirname + "/productos.txt");
let fileMessages = new moduleContenedor.Contenedor(__dirname + "/messages.txt");

//iniciamos el websocket
io.on("connection", async (socket) => {
  console.log(emoji.get("pizza"), "usuario conectado");

  const messages = await fileMessages.getAll();

  socket.emit("messageBackend", messages);

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
    const id = await fileMessages.saveProduct(currentMessage);
    messages.push(currentMessage);
    io.sockets.emit("messageBackend", messages);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

app.use(express.static("public"));

app.set("views", "./src/views");
app.set("view engine", "hbs");

app.get("/", async (req, res) => {
  res.render("main", { viewSave: true });
});

app.get("/productos", async (req, res) => {
  const products = await contenedor.getAll();
  const existProducts = products.length === 0 ? false : true;
  res.render("main", { products, viewList: true, existProducts });
});

app.post("/productos", async (req, res) => {
  const { title, price, thumbnail } = req.body;
  const product = { title, price, thumbnail };

  const id = await contenedor.saveProduct(product);

  res.redirect("/");
});

httpServer.listen(8080, () => console.log("Server started on 8080"));
