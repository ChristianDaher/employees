import { Router } from "express";
import PlanController from "../controllers/Plan.controller";
import { Authenticate } from "../middlewares/tokens.middleware";
const router = Router();

router.get("/",Authenticate() , PlanController.getAllPlans);
router.get("/search",Authenticate() , PlanController.searchPlans);
router.get("/:id",Authenticate() , PlanController.getPlanById);
router.post("/",Authenticate() , PlanController.createPlan);
router.put("/:id",Authenticate() , PlanController.updatePlan);
router.delete("/:id",Authenticate() , PlanController.deletePlan);

export default router;
