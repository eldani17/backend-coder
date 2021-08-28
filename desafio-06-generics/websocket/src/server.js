const express = require("express");
const emoji = require("node-emoji");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const moduleContenedor = require("./contenedor");

let contenedor = new moduleContenedor.Contenedor(__dirname + "/messages.txt");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//const messages = [];

//iniciamos el websocket
io.on("connection", async (socket) => {
  console.log(emoji.get("pizza"), "usuario conectado");
  const messages = await contenedor.getAll();

  socket.emit("messageBackend", messages);

  socket.on("disconnect", () => {
    console.log(emoji.get("fire"), "Usuario desconectado");
  });

  socket.on("messageFront", async (data) => {
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
    const id = await contenedor.saveProduct(currentMessage);
    messages.push(currentMessage);
    io.sockets.emit("messageBackend", messages);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

httpServer.listen(8080, () =>
  console.log(emoji.get("computer"), "Server started on 8080")
);
