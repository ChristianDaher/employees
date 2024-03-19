import { Router } from "express";
import PlanController from "../controllers/Plan.controller";
import { Authenticate } from "../middlewares/tokens.middleware";
const router = Router();

router.get("/", PlanController.getAllPlans);
router.get("/search", PlanController.searchPlans);
router.get("/:id", PlanController.getPlanById);
router.post("/", PlanController.createPlan);
router.put("/:id", PlanController.updatePlan);
router.delete("/:id", PlanController.deletePlan);

export default router;
