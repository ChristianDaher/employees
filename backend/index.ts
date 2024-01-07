import express from "express";
import db from "./database/sequelize";
import departmentsRoutes from "./routes/Department.route";
import userRoutes from "./routes/User.route";

require("dotenv").config();

const app = express();
const port = Number(process.env.PORT) || 8080;

app.use("/departments", departmentsRoutes);
app.use("/users", userRoutes);

db.authenticate()
  .then(() =>
    console.log("Connection to the database has been established successfully.")
  )
  .catch((err) => console.error("Unable to connect to the database:", err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
