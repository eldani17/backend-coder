import dotenv from "dotenv";

dotenv.config();

export const config = {
  client: "mysql2",
  connection: {
    host: process.env.HOST,
    user: process.env.USERDB,
    password: process.env.PASSWORDDB,
    database: process.env.DATABASE,
  },
};

export const configSqlite3 = {
  client: "sqlite3",
  connection: {
    filename: "./sqlite/mydb.sqlite",
    useNullAsDefault: true,
  },
};
