const express = require("express");
const handlebars = require("express-handlebars");
const moduleContenedor = require("./contenedor");

const app = express();

let contenedor = new moduleContenedor.Contenedor(__dirname + "/productos.txt");

// const fs = require("fs");
const data = [
  { nombre: "nombre 1" },
  { nombre: "nombre 2" },
  { nombre: "nombre 3" },
];

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

app.listen(8080, () => console.log("Server started on 8080"));
