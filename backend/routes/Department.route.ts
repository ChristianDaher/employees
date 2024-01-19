import { Router } from "express";
import DepartmentController from "../controllers/Department.controller";

const router = Router();

router.get("/", DepartmentController.getAllDepartments);
router.get("/search", DepartmentController.searchDepartments);
router.get("/:id", DepartmentController.getDepartmentById);
router.post("/", DepartmentController.createDepartment);
router.put("/:id", DepartmentController.updateDepartment);
router.delete("/:id", DepartmentController.deleteDepartment);

export default router;
