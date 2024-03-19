import { Router } from "express";
import CustomerController from "../controllers/Customer.controller";
import { Authenticate } from "../middlewares/tokens.middleware";
const router = Router();

router.get("/", Authenticate() ,CustomerController.getAllCustomers);
router.get("/search", Authenticate() ,CustomerController.searchCustomers);
router.get("/:id",Authenticate() , CustomerController.getCustomerById);
router.post("/", Authenticate() ,CustomerController.createCustomer);
router.put("/:id",Authenticate() , CustomerController.updateCustomer);
router.delete("/:id", Authenticate() ,CustomerController.deleteCustomer);

export default router;
