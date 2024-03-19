import { Router } from "express";
import UserController from "../controllers/User.controller";
import { Authenticate } from "../middlewares/tokens.middleware";


const router = Router();

router.get("/", Authenticate() ,UserController.getAllUsers);
router.get("/search",Authenticate() , UserController.searchUsers);
router.get("/:id",Authenticate() , UserController.getUserById);
router.post("/",Authenticate() , UserController.createUser);
router.put("/:id",Authenticate() , UserController.updateUser);
router.delete("/:id",Authenticate() , UserController.deleteUser);

export default router;
