require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "employees",
    host: process.env.DB_HOST || "127.0.0.1",
    PORT: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
  },
  test: {
    username: process.env.DB_USERNAME_TEST || "root",
    password: process.env.DB_PASSWORD_TEST || "",
    database: process.env.DB_NAME_TEST || "employees_test",
    host: process.env.DB_HOST_TEST || "127.0.0.1",
    PORT: Number(process.env.DB_PORT_TEST) || 3306,
    dialect: process.env.DB_DIALECT_TEST || "mysql",
  },
  production: {
    username: process.env.DB_USERNAME_PRODUCTION || "root",
    password: process.env.DB_PASSWORD_PRODUCTION || "",
    database: process.env.DB_NAME_PRODUCTION || "employees_production",
    host: process.env.DB_HOST_PRODUCTION || "127.0.0.1",
    PORT: Number(process.env.DB_PORT_PRODUCTION) || 3306,
    dialect: process.env.DB_DIALECT_PRODUCTION || "mysql",
  },
};
