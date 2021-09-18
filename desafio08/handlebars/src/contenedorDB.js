import knex from "knex";

export default class ContenedorDB {
  constructor(config, nameTable) {
    this.nameTable = nameTable;
    this.config = config;

    this.db = knex(config);
  }

  async createTables() {
    try {
      const existTable = await this.db.schema.hasTable(this.nameTable);

      if (!existTable) {
        if (this.nameTable == "messages") {
          await this.db.schema.createTable(this.nameTable, (table) => {
            table.increments("id").primary().notNullable(),
              table.string("email", 50).notNullable();
            table.string("message").notNullable();
            table.string("date", 30).notNullable();
          });
        }
        if (this.nameTable == "products") {
          await this.db.schema.createTable(this.nameTable, (table) => {
            table.increments("id").primary().notNullable(),
              table.string("title", 50).notNullable();
            table.integer("price").notNullable();
            table.string("thumbnail").notNullable();
          });
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      //this.db.destroy();
    }
  }

  async getAll() {
    try {
      const response = await this.db.select().from(this.nameTable);
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      //this.db.destroy();
    }
  }

  async getById(id) {
    try {
      const response = await this.db
        .select()
        .from(this.nameTable)
        .where("id", id);
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      //this.db.destroy();
    }
  }

  async save(element) {
    try {
      await this.db.insert(element).from(this.nameTable);
    } catch (error) {
      console.log(error);
    } finally {
      //this.db.destroy();
    }
  }

  async update(element) {
    try {
      const { id, ...rest } = element;
      await this.db.from(this.nameTable).update(rest).where("id", id);
    } catch (error) {
      console.log(error);
    } finally {
      //this.db.destroy();
    }
  }

  async delete(id) {
    try {
      await this.db.from(this.nameTable).del().where("id", id);
    } catch (error) {
      console.log(error);
    } finally {
      //this.db.destroy();
    }
  }
}
