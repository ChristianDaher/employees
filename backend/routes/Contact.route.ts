import { Router } from "express";
import ContactController from "../controllers/Contact.controller";

const router = Router();

router.get("/", ContactController.getAllContacts);
router.get("/:id", ContactController.getContactById);
router.post("/", ContactController.createContact);
router.put("/:id", ContactController.updateContact);
router.delete("/:id", ContactController.deleteContact);

export default router;
