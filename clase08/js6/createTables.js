import { db } from "./db.js";

export async function createTables() {
  try {
    const existTableUsers = await db.schema.hasTable("users");

    if (!existTableUsers) {
      await db.schema.createTable("users", (table) => {
        table.increments("id").primary().notNullable(),
          table.string("name", 50).notNullable();
      });
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    db.destroy();
  }
}
