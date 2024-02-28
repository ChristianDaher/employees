import { Router } from "express";
import ContactCustomerController from "../controllers/ContactCustomer.controller";

const router = Router();

router.get("/", ContactCustomerController.getAllContactCustomers);
router.get("/:id", ContactCustomerController.getContactCustomerById);

export default router;
