import { Router } from "express";
import RegionController from "../controllers/Region.controller";
import { Authenticate } from "../middlewares/tokens.middleware";
const router = Router();

router.get("/", Authenticate() ,RegionController.getAllRegions);
router.get("/search",Authenticate() , RegionController.searchRegions);
router.get("/:id", Authenticate() ,RegionController.getRegionById);
router.post("/",Authenticate() , RegionController.createRegion);
router.put("/:id", Authenticate() ,RegionController.updateRegion);
router.delete("/:id",Authenticate() , RegionController.deleteRegion);

export default router;
