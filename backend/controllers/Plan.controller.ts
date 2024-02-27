import { Request, Response } from "express";
import Plan from "../database/models/Plan.model";
import User from "../database/models/User.model";
import ContactCustomer from "../database/models/ContactCustomer.model";
import Contact from "../database/models/Contact.model";
import Customer from "../database/models/Customer.model";
import Department from "../database/models/Department.model";
import Region from "../database/models/Region.model";
import { ValidationError, Op } from "sequelize";

const modelFormat = {
  attributes: { exclude: ["userId", "contactCustomerId"] },
  include: [
    User,
    {
      model: ContactCustomer,
      include: [
        {
          model: Contact,
          include: [Department],
          attributes: { exclude: ["departmentId"] },
        },
        {
          model: Customer,
          include: [Region],
          attributes: { exclude: ["regionId"] },
        },
      ],
      attributes: { exclude: ["contactId", "customerId"] },
    },
  ],
};
export default class PlanController {
  static async getAllPlans(req: Request, res: Response) {
    const plans = await Plan.findAll(modelFormat);
    res.json(plans);
  }

  static async searchPlans(req: Request, res: Response) {
    const query = req.query.q?.toString();
    let plans;
    // if (!query) {
    //   plans = await User.findAll(modelFormat);
    // } else {
    //   plans = await User.findAll({
    //     ...modelFormat,
    //     where: {
    //       [Op.or]: [
    //         {
    //           firstName: {
    //             [Op.like]: `%${query}%`,
    //           },
    //         },
    //         {
    //           lastName: {
    //             [Op.like]: `%${query}%`,
    //           },
    //         },
    //         {
    //           phoneNumber: {
    //             [Op.like]: `%${query}%`,
    //           },
    //         },
    //         {
    //           email: {
    //             [Op.like]: `%${query}%`,
    //           },
    //         },
    //         {
    //           "$department.name$": {
    //             [Op.like]: `%${query}%`,
    //           },
    //         },
    //       ],
    //     },
    //   });
    // }
    res.json(plans);
  }

  static async getPlanById(req: Request<{ id: string }>, res: Response) {
    const plan = await Plan.findByPk(req.params.id, modelFormat);
    if (plan) {
      res.json(plan);
    } else {
      res.status(404).send("Plan not found");
    }
  }

  static async createPlan(req: Request, res: Response): Promise<Response> {
    // try {
    //   if (req.body.department && req.body.department.id) {
    //     const department = await Department.findByPk(req.body.department.id);
    //     if (!department) {
    //       return res.status(400).json({ error: "Department not found." });
    //     }
    //     req.body.departmentId = department.id;
    //     delete req.body.department;
    //   } else req.body.departmentId = null;
    //   const newUser = await User.create(req.body);
    //   return res.json(newUser);
    // } catch (error) {
    //   if (
    //     error instanceof ValidationError &&
    //     error.name === "SequelizeUniqueConstraintError"
    //   ) {
    //     return res.status(400).json({ error: "User email must be unique." });
    //   }
    //   return res.status(500).json({ error: "An unexpected error occurred." });
    // }
    return res.status(500).json({ error: "Go fuck yourself." });
  }

  static async updatePlan(req: Request<{ id: string }>, res: Response) {
    // try {
    //   if (req.body.department && req.body.department.id) {
    //     const department = await Department.findByPk(req.body.department.id);
    //     if (!department) {
    //       return res.status(400).json({ error: "Department not found." });
    //     }
    //     req.body.departmentId = department.id;
    //     delete req.body.department;
    //   } else req.body.departmentId = null;
    //   const user = await User.findByPk(req.params.id);
    //   if (user) {
    //     const updatedUser = await user.update(req.body);
    //     res.json(updatedUser);
    //   } else {
    //     res.status(404).send("User not found");
    //   }
    // } catch (error) {
    //   if (
    //     error instanceof ValidationError &&
    //     error.name === "SequelizeUniqueConstraintError"
    //   ) {
    //     return res.status(400).json({ error: "User email must be unique." });
    //   }
    //   return res.status(500).json({ error: "An unexpected error occurred." });
    // }
    return res.status(500).json({ error: "Go fuck yourself." });
  }

  static async deletePlan(req: Request<{ id: string }>, res: Response) {
    const plan = await Plan.findByPk(req.params.id);
    if (plan) {
      await plan.destroy();
      res.status(204).send();
    } else {
      res.status(404).send("Plan not found");
    }
  }
}
