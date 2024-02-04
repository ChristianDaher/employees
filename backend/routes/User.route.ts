import { Router } from "express";
import UserController from "../controllers/User.controller";

const router = Router();

router.get("/", UserController.getAllUsers);
router.get("/search", UserController.searchUsers);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
