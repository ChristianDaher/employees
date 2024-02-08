import { Router } from "express";
import CustomerController from "../controllers/Customer.controller";

const router = Router();

router.get("/", CustomerController.getAllCustomers);
router.get("/search", CustomerController.searchCustomers);
router.get("/:id", CustomerController.getCustomerById);
router.post("/", CustomerController.createCustomer);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

export default router;
