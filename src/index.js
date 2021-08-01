const express = require("express");
const moment = require("moment");
const fs = require("fs");

class Contenedor {
  constructor(nameFile) {
    this.nameFile = "src/" + nameFile;
    this.id = 0;
    this.data = [];
  }

  async save(product) {
    await this.getAll();
    this.id++;
    this.data.push({
      id: this.id,
      product,
    });
    try {
      await fs.promises.writeFile(this.nameFile, JSON.stringify(this.data));
    } catch (error) {
      console.log("save", error);
    }
  }

  async getById(id) {
    try {
      const dataFile = await fs.promises.readFile(this.nameFile, "utf-8");
      const data = JSON.parse(dataFile);
      const product = data.find((p) => p.id === id);
      return product ? product : null;
    } catch (error) {
      console.log("getById error", error);
    }
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.nameFile, "utf-8");
      if (data) {
        this.data = JSON.parse(data);
        this.data.map((product) => {
          if (this.id < product.id) {
            this.id = product.id;
          }
        });
        console.log("getAll()", this.data);
      }
    } catch (error) {
      console.log("getAll ERRROR", error);
      return;
    }
  }

  async deleteById(id) {
    try {
      const dataFile = await fs.promises.readFile(this.nameFile, "utf-8");
      if (dataFile) {
        const data = JSON.parse(dataFile);
        const result = data.filter((p) => {
          p.id !== id;
        });

        await fs.promises.unlink(this.nameFile);
        await fs.promises.writeFile(this.nameFile, JSON.stringify(result));
        console.log("id borrado ", id);
      }
    } catch (error) {
      console.log("deleteById", error);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.unlink(this.nameFile);
      this.data = [];
      this.id = 0;
    } catch (error) {
      console.log("deleteAll", error);
    }
  }
}

const app = express();

app.get("/", (req, resp, next) => {
  resp.send(`Home servidor`);
});

//#region DESAFIO GENERICO 3
app.get("/test", (req, resp, next) => {
  resp.send(`<h1 style="color:blue">Biendovenidos a Express</h1>`);
});

let visitas = 0;
app.get("/visitas", (req, resp, next) => {
  visitas++;
  resp.send(`La cantidad de visitas es ${visitas}`);
});

app.get("/fyh", (req, resp, next) => {
  let currentDate = moment();
  resp.send(`La fecha es ${currentDate.format("DD-MM-YYYY")}`);
});
//#endregion

//#region DESAFIO 3
app.get("/productos", (req, resp, next) => {
  const listProducts = new Contenedor("productos.txt");

  async function writeFile() {
    await listProducts.getAll();
    const data = JSON.stringify(listProducts.data);
    resp.send(
      `
      <h1>Lista de Productos</h1>
      ${data}
    `
    );
  }

  writeFile();
});

app.get("/productoRandom", (req, resp, next) => {
  const listProducts = new Contenedor("productos.txt");

  async function writeFile() {
    await listProducts.getAll();

    function getRandom(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    const randomElement = getRandom(listProducts.data);
    const data = JSON.stringify(randomElement);
    resp.send(
      `
        <h1>Elemento de la Lista RANDOM:</h1>
        ${data}
      `
    );
  }

  writeFile();
});
//#endregion

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`servidor express corriendo en port ${PORT}`);
});

server.on("error", (error) => {
  console.log(error);
});
