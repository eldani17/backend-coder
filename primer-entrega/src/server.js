const express = require("express");
const { Router } = express;
const moduleContenedor = require("./contenedor");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let productsDb = new moduleContenedor.Contenedor(__dirname + "/products.txt");
let cartDb = new moduleContenedor.Contenedor(__dirname + "/cart.txt");

const routerProducts = new Router();
const routerCart = new Router();

app.get("/", (req, res) => {
  //renderizar mi app
  res.send("<h1>Hola primer entrega</h1>");
});

routerProducts.get("/:id?", async (req, res) => {
  const products = await productsDb.getAll();
  const { id } = req.params;
  let currentProducts;

  if (id) {
    currentProducts = products.filter((p) => p.id == id);
  } else {
    currentProducts = products;
  }

  res.status(200).json(currentProducts);
});

routerProducts.post("/", async (req, res) => {
  const { name, description, code, thumbnail, price, stock } = req.body;
  const timestamp = new Date().getTime();
  const product = {
    timestamp,
    name,
    description,
    code,
    thumbnail,
    price,
    stock,
  };
  const id = await productsDb.saveProduct(product);

  res.status(200).json(product);
});

routerProducts.put("/:id", async (req, res) => {
  let { timestamp, name, description, code, thumbnail, price, stock } =
    req.body;
  const id = req.params.id;
  const products = await productsDb.getAll();
  const product = products.find((p) => p.id == id);
  if (product) {
    product.timestamp = timestamp ? timestamp : product.timestamp;
    product.name = name ? name : product.name;
    product.description = description ? description : product.description;
    product.code = code ? code : product.code;
    product.thumbnail = thumbnail ? thumbnail : product.thumbnail;
    product.price = price ? price : product.price;
    product.stock = stock ? stock : product.stock;
    await productsDb.updateProduct(products);
    res.status(200).json({ actualizada: id });
  } else {
    res.status(200).json({ error: `producto no encontrado con id: ${id}` });
  }
});

routerProducts.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const productExist = await productsDb.getById();

  if (productExist) {
    await productsDb.deleteById(id);
    res.status(200).json({ msg: "producto borrado" });
  } else {
    res.status(200).json({ error: `producto no encontrado con id: ${id}` });
  }
});

routerCart.get("/", async (req, res) => {
  const carts = await cartDb.getAll();
  res.status(200).json(carts);
});

routerCart.get("/:id/productos", async (req, res) => {
  const { id } = req.params;
  const cart = await cartDb.getById(id);
  const products = cart?.products;
  res.status(200).json(products ? products : []);
});

routerCart.post("/", async (req, res) => {
  const newCart = { products: [] };
  const id = await cartDb.saveProduct(newCart);

  res.status(200).json({ carrito: id });
});

routerCart.post("/:id/productos", async (req, res) => {
  const { id } = req.params;
  const { timestamp, name, description, code, thumbnail, price, stock } =
    req.body;
  const id_prod = req.body.id;

  const carts = await cartDb.getAll();
  const cart = carts.find((c) => c.id == id);
  const product = {
    id: id_prod,
    timestamp,
    name,
    description,
    code,
    thumbnail,
    price,
    stock,
  };
  cart.products = [...cart.products, product];
  await cartDb.updateProduct(carts);
  res.status(200).json({ actualizada: id });
});

routerCart.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const cartExist = await cartDb.getById(id);
  if (cartExist) {
    await cartDb.deleteById(id);
    res.status(200).json({ msg: "carrito borrado" });
  } else {
    res.status(200).json({ error: `carrito no encontrado con id: ${id}` });
  }
});

routerCart.delete("/:id/productos/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;

  const carts = await cartDb.getAll();
  const cart = carts.find((c) => c.id == id);
  cart.products = cart.products.filter((p) => p.id != id_prod);
  await cartDb.updateProduct(carts);
  res.status(200).json({ productDelete: id });
});

const PORT = 8080;
app.use("/api/productos", routerProducts);
app.use("/api/carrito", routerCart);

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
