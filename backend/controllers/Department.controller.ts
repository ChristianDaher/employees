import { Request, Response } from "express";
import Department from "../database/models/Department.model";

export default class DepartmentController {
  static async getAllDepartments(req: Request, res: Response) {
    const departments = await Department.findAll();
    res.json(departments);
  }

  static async getDepartmentById(req: Request<{ id: string }>, res: Response) {
    const department = await Department.findByPk(req.params.id);
    if (department) {
      res.json(department);
    } else {
      res.status(404).send("Department not found");
    }
  }

  static async createDepartment(req: Request, res: Response) {
    const newDepartment = await Department.create(req.body);
    res.json(newDepartment);
  }

  static async updateDepartment(req: Request<{ id: string }>, res: Response) {
    const department = await Department.findByPk(req.params.id);
    if (department) {
      const updatedDepartment = await department.update(req.body);
      res.json(updatedDepartment);
    } else {
      res.status(404).send("Department not found");
    }
  }

  static async deleteDepartment(req: Request<{ id: string }>, res: Response) {
    const department = await Department.findByPk(req.params.id);
    if (department) {
      await department.destroy();
      res.status(204).send();
    } else {
      res.status(404).send("Department not found");
    }
  }
}
