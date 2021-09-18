import { db } from "./db.js";

const users = [{ name: "name1" }, { name: "name2" }, { name: "name3" }];

(async function () {
  //await create();
  await read();
  //await update();
  //await deleteUser();
})();

async function create() {
  try {
    await db.insert(users).from("users");
  } catch (error) {
    console.log(error);
  } finally {
    db.destroy();
  }
}

async function read() {
  try {
    const response = await db.select().from("users");
    console.log("response", response);
  } catch (error) {
    console.log(error);
  } finally {
    db.destroy();
  }
}

async function update() {
  try {
    await db.from("users").update("name", "nuevo nombre").where("id", 1);
    console.log("response", response);
  } catch (error) {
    console.log(error);
  } finally {
    db.destroy();
  }
}

async function deleteUser() {
  try {
    await db.from("users").del().where("id", 1);
    console.log("usuario borrado");
  } catch (error) {
    console.log(error);
  } finally {
    db.destroy();
    console.log("destroy delete");
  }
}
