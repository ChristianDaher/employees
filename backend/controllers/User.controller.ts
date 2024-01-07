import { Request, Response } from "express";
import User from "../database/models/User.model";
import Department from "../database/models/Department.model";

export default class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const users = await User.findAll({
      include: Department,
    });
    res.json(users);
  }

  static async getUserById(req: Request<{ id: string }>, res: Response) {
    const user = await User.findByPk(req.params.id, {
      include: Department,
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  }

  static async createUser(req: Request, res: Response) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  }

  static async updateUser(req: Request<{ id: string }>, res: Response) {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const updatedUser = await user.update(req.body);
      res.json(updatedUser);
    } else {
      res.status(404).send("User not found");
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
