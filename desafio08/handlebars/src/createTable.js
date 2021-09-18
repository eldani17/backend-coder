import knex from "knex";

export async function createTables(config, nameTable) {
  try {
    const db = knex(config);
    const existTable = await db.schema.hasTable(nameTable);

    if (!existTable) {
      if (nameTable == "messages") {
        await db.schema.createTable(nameTable, (table) => {
          table.increments("id").primary().notNullable(),
            table.string("email", 50).notNullable();
          table.string("message").notNullable();
          table.string("date", 30).notNullable();
        });
      }
      if (nameTable == "products") {
        await db.schema.createTable(nameTable, (table) => {
          table.increments("id").primary().notNullable(),
            table.string("title", 50).notNullable();
          table.number("price").notNullable();
          table.thumbnail("title").notNullable();
        });
      }
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    db.destroy();
  }
}
