import { Request, Response } from "express";
import Department from "../database/models/Department.model";
import { ValidationError, Op } from "sequelize";

export default class DepartmentController {
  static async getAllDepartments(req: Request, res: Response) {
    const departments = await Department.findAll();
    res.json(departments)
  }

  static async searchDepartments(req: Request, res: Response) {
    const query = req.query.q?.toString();
    let departments;
    if (!query) {
      departments = await Department.findAll();
    }
    departments = await Department.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
    });
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

  static async createDepartment(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const newDepartment = await Department.create(req.body);
      return res.json(newDepartment);
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res
          .status(400)
          .json({ error: "Department name must be unique." });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }

  static async updateDepartment(req: Request<{ id: string }>, res: Response) {
    try {
      const department = await Department.findByPk(req.params.id);
      if (department) {
        const updatedDepartment = await department.update(req.body);
        res.json(updatedDepartment);
      } else {
        res.status(404).send("Department not found");
      }
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res
          .status(400)
          .json({ error: "Department name must be unique." });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
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