import { Router } from "express";
import RegionController from "../controllers/Region.controller";
import { Authenticate } from "../middlewares/tokens.middleware";
const router = Router();

router.get("/", RegionController.getAllRegions);
router.get("/search", RegionController.searchRegions);
router.get("/:id", RegionController.getRegionById);
router.post("/", RegionController.createRegion);
router.put("/:id", RegionController.updateRegion);
router.delete("/:id", RegionController.deleteRegion);

export default router;
