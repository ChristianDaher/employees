import { Request, Response } from "express";
import User from "../database/models/User.model";
import Department from "../database/models/Department.model";
import { ValidationError, Op } from "sequelize";

const modelFormat = {
  attributes: { exclude: ["departmentId"] },
  include: Department,
};

export default class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const users = await User.findAll(modelFormat);
    res.json(users);
  }

  static async searchUsers(req: Request, res: Response) {
    const query = req.query.q?.toString();
    let users;
    if (!query) {
      users = await User.findAll(modelFormat);
    } else {
      users = await User.findAll({
        ...modelFormat,
        where: {
          [Op.or]: [
            {
              firstName: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              lastName: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              phoneNumber: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              email: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              "$department.name$": {
                [Op.like]: `%${query}%`,
              },
            },
          ],
        },
      });
    }
    res.json(users);
  }

  static async getUserById(req: Request<{ id: string }>, res: Response) {
    const user = await User.findByPk(req.params.id, modelFormat);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  }

  static async createUser(req: Request, res: Response): Promise<Response> {
    try {
      if (req.body.department && req.body.department.id) {
        const department = await Department.findByPk(req.body.department.id);
        if (!department) {
          return res.status(400).json({ error: "Department not found." });
        }
        req.body.departmentId = department.id;
        delete req.body.department;
      } else req.body.departmentId = null;
      const newUser = await User.create(req.body);
      return res.json(newUser);
    } catch (error) {
      console.log(error);
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: "User email must be unique." });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }

  static async updateUser(req: Request<{ id: string }>, res: Response) {
    try {
      if (req.body.department && req.body.department.id) {
        const department = await Department.findByPk(req.body.department.id);
        if (!department) {
          return res.status(400).json({ error: "Department not found." });
        }
        req.body.departmentId = department.id;
        delete req.body.department;
      } else req.body.departmentId = null;
      const user = await User.findByPk(req.params.id);
      if (user) {
        const updatedUser = await user.update(req.body);
        res.json(updatedUser);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: "User email must be unique." });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }

  static async deleteUser(req: Request<{ id: string }>, res: Response) {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).send("User not found");
    }
  }
}
