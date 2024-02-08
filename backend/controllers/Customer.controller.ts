import { Request, Response } from "express";
import Customer from "../database/models/Customer.model";
import Region from "../database/models/Region.model";
import Contact from "../database/models/Contact.model";
import { ValidationError, Op } from "sequelize";

export default class CustomerController {
  static async getAllCustomers(req: Request, res: Response) {
    const customers = await Customer.findAll({
      attributes: { exclude: ["regionId"] },
      include: [Region, Contact],
    });
    res.json(customers);
  }

  static async searchCustomers(req: Request, res: Response) {
    const query = req.query.q?.toString();
    let customers;
    if (!query) {
      customers = await Customer.findAll({
        attributes: { exclude: ["regionId"] },
        include: Region,
      });
    }
    customers = await Customer.findAll({
      attributes: { exclude: ["regionId"] },
      include: Region,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            phoneNumber: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            note: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            customerCode: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            accountNumber: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            "$region.name$": {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
    });
    res.json(customers);
  }

  static async getCustomerById(req: Request<{ id: string }>, res: Response) {
    const customer = await Customer.findByPk(req.params.id, {
      attributes: { exclude: ["regionId"] },
      include: Region,
    });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).send("Customer not found");
    }
  }

  static async createCustomer(req: Request, res: Response) {
    try {
      if (req.body.region && req.body.region.id) {
        const region = await Region.findByPk(req.body.region.id);
        if (!region) {
          return res.status(400).json({ error: "Region not found." });
        }
        req.body.regionId = region.id;
        delete req.body.region;
      } else req.body.regionId = null;
      const newCustomer = await Customer.create(req.body);
      return res.json(newCustomer);
    } catch (error) {
      console.log(error);
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let attribute = "";
        for (let i = 0; i < error.errors.length; i++) {
          if (error.errors[i].path === "phoneNumber") {
            attribute = "Phone number";
          } else if (error.errors[i].path === "accountNumber") {
            attribute = "Account number";
          } else if (error.errors[i].path === "customerCode") {
            attribute = "Customer code";
          }
        }
        return res.status(400).json({ error: `${attribute} must be unique.` });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }

  static async updateCustomer(req: Request<{ id: string }>, res: Response) {
    try {
      if (req.body.region && req.body.region.id) {
        const region = await Region.findByPk(req.body.region.id);
        if (!region) {
          return res.status(400).json({ error: "Region not found." });
        }
        req.body.regionId = region.id;
        delete req.body.region;
      } else req.body.regionId = null;
      const customer = await Customer.findByPk(req.params.id);
      if (customer) {
        const updatedCustomer = await customer.update(req.body);
        res.json(updatedCustomer);
      } else {
        res.status(404).send("Customer not found");
      }
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let attribute = "";
        for (let i = 0; i < error.errors.length; i++) {
          if (error.errors[i].path === "phoneNumber") {
            attribute = "Phone number";
          } else if (error.errors[i].path === "accountNumber") {
            attribute = "Account number";
          } else if (error.errors[i].path === "customerCode") {
            attribute = "Customer code";
          }
        }
        return res.status(400).json({ error: `${attribute} must be unique.` });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }

  static async deleteCustomer(req: Request<{ id: string }>, res: Response) {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      await customer.destroy();
      res.status(204).send();
    } else {
      res.status(404).send("Customer not found");
    }
  }
}
