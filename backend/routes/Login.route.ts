import { Router } from "express";
import LoginController from "../controllers/Login.controller";

const router = Router();

router.post("/", LoginController.validateCredentials);

export default router;
