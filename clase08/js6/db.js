import { config } from "./config.js";
import knex from "knex";
import { createTables } from "./createTables.js";

export const db = knex(config);

(async function () {
  await createTables();
})();
