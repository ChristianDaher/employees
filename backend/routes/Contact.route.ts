import { Router } from "express";
import ContactController from "../controllers/Contact.controller";
import { Authenticate } from "../middlewares/tokens.middleware";
const router = Router();

router.get("/",Authenticate() , ContactController.getAllContacts);
router.get("/search",Authenticate() , ContactController.searchContacts);
router.get("/:id",Authenticate() , ContactController.getContactById);
router.post("/", Authenticate() ,ContactController.createContact);
router.put("/:id",Authenticate() , ContactController.updateContact);
router.delete("/:id", Authenticate() ,ContactController.deleteContact);

export default router;
