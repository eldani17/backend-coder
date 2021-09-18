const { config } = require("./config.js");
const knex = require("knex")(config);

console.log(config);

(async function () {
  try {
    const users = await knex.select().from("usuarios");
    console.log(users);
  } catch (error) {
    console.log("error", error);
  } finally {
    knex.destroy();
  }
})();
