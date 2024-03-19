import { Router } from "express";
import DepartmentController from "../controllers/Department.controller";
import { Authenticate } from "../middlewares/tokens.middleware";
const router = Router();

router.get("/",Authenticate() , DepartmentController.getAllDepartments);
router.get("/search",Authenticate() , DepartmentController.searchDepartments);
router.get("/:id",Authenticate() , DepartmentController.getDepartmentById);
router.post("/", Authenticate() ,DepartmentController.createDepartment);
router.put("/:id",Authenticate() , DepartmentController.updateDepartment);
router.delete("/:id", Authenticate() ,DepartmentController.deleteDepartment);

export default router;
