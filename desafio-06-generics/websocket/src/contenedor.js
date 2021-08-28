const fs = require("fs");

class Contenedor {
  constructor(nameFile) {
    this.nameFile = nameFile;
  }

  transformObjectToStringJSON(array) {
    return JSON.stringify(array, null, 2);
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.nameFile, "utf-8");
      const list = await JSON.parse(data);
      return list;
    } catch (error) {
      console.log("getAll ERROR", error);
    }
  }

  async saveList(updateList) {
    try {
      await fs.promises.writeFile(this.nameFile, updateList);
    } catch (error) {
      console.log("save", error);
    }
  }

  async saveProduct(product) {
    const currentList = await this.getAll();
    const lastId = currentList.length
      ? currentList[currentList.length - 1].id
      : 0;
    product.id = lastId + 1;

    currentList.push(product);

    const jsonList = this.transformObjectToStringJSON(currentList);

    await this.saveList(jsonList);

    return product.id;
  }

  async getById(id) {
    try {
      const list = await this.getAll();
      const productById = list.find((product) => product.id == id);
      return productById ? productById : null;
    } catch (error) {
      console.log("getById error", error);
    }
  }

  async deleteById(id) {
    const currentList = await this.getAll();
    const product = await this.getById(id);

    if (product) {
      const list = currentList.filter((product) => product.id !== id);
      const jsonList = this.transformObjectToStringJSON(list);
      await this.saveList(jsonList);
    } else {
      console.log("id no encontrado");
    }
  }

  async deleteAll() {
    const jsonList = this.transformObjectToStringJSON([]);
    await this.saveList(jsonList);
  }
}

module.exports.Contenedor = Contenedor;
