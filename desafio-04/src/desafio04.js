const express = require("express");
const { Router } = express;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("./src/files"));

let products = [
  {
    id: 1,
    title: "title 1",
    price: "23",
    thumbnail: "url....1",
  },
  {
    id: 2,
    title: "title 2",
    price: "23",
    thumbnail: "url....1",
  },
  {
    id: 3,
    title: "title 3",
    price: "23",
    thumbnail: "url....1",
  },
];

let idProduct = products.length + 1;

const routerProducts = new Router();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/files/index.html");
});

routerProducts.get("/", (req, res) => {
  res.status(200).send(products);
});

routerProducts.get("/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((e) => e.id == id);
  try {
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(200).json({ error: "producto no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: "Mensaje" });
  }
});

routerProducts.post("/", (req, res) => {
  const { title, price, thumbnail } = req.body;
  const product = { id: idProduct, title, price, thumbnail };
  products.push(product);
  idProduct++;
  res.status(200).json(product);
});

routerProducts.put("/:id", (req, res) => {
  let { title, price, thumbnail } = req.body;
  const id = req.params.id;
  const idx = products.findIndex((element) => element.id == id);

  if (idx === -1) {
    res.status(200).json({ error: `producto no encontrado con id: ${id}` });
  } else {
    title = title ? title : products[idx].title;
    price = price ? price : products[idx].price;
    thumbnail = thumbnail ? thumbnail : products[idx].thumbnail;
    products[idx] = { ...products[idx], title, price, thumbnail };

    res.status(200).json({ actualizada: products[idx] });
  }
});

routerProducts.delete("/:id", (req, res) => {
  const id = req.params.id;
  const idx = products.findIndex((element) => element.id == id);

  if (idx === -1) {
    res.status(200).json({ error: `producto no encontrado con id: ${id}` });
  } else {
    products.splice(idx, 1);
    res.status(200).json({ msg: "producto borrado" });
  }
});

const PORT = 8081;
app.use("/api/productos", routerProducts);
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
