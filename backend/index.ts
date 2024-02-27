import express from "express";
import cors from "cors";
import db from "./database/sequelize";
import departmentRoutes from "./routes/Department.route";
import regionRoutes from "./routes/Region.route";
import userRoutes from "./routes/User.route";
import customerRoutes from "./routes/Customer.route";
import contactRoutes from "./routes/Contact.route";
import planRoutes from "./routes/Plan.route";

require("dotenv").config();

const app = express();
const port = Number(process.env.PORT) || 8080;

app.use(cors());
app.use(express.json());

app.use("/departments", departmentRoutes);
app.use("/regions", regionRoutes);
app.use("/users", userRoutes);
app.use("/customers", customerRoutes);
app.use("/contacts", contactRoutes);
app.use("/plans", planRoutes);

db.authenticate()
  .then(() =>
    console.log("Connection to the database has been established successfully.")
  )
  .catch((err) => console.error("Unable to connect to the database:", err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
