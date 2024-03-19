import { Router } from "express";
import ContactCustomerController from "../controllers/ContactCustomer.controller";
import { Authenticate } from "../middlewares/tokens.middleware";
const router = Router();

router.get("/", Authenticate() ,ContactCustomerController.getAllContactCustomers);
router.get("/:id", Authenticate() ,ContactCustomerController.getContactCustomerById);

export default router;
