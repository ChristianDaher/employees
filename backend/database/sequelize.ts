import { Sequelize } from "sequelize-typescript";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

module.exports = new Sequelize({
  dialect: "mysql",
  database: process.env.DB_NAME || "employees",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  models: [path.join(__dirname, "/models")],
});
