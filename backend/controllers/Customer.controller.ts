import { Request, Response } from "express";
import Customer from "../database/models/Customer.model";
import Region from "../database/models/Region.model";

export default class CustomerController {
  static async getAllCustomers(req: Request, res: Response) {
    const customers = await Customer.findAll({
      include: Region,
    });
    res.json(customers);
  }

  static async getCustomerById(req: Request<{ id: string }>, res: Response) {
    const customer = await Customer.findByPk(req.params.id, {
      include: Region,
    });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).send("Customer not found");
    }
  }

  static async createCustomer(req: Request, res: Response) {
    const newCustomer = await Customer.create(req.body);
    res.json(newCustomer);
  }

  static async updateCustomer(req: Request<{ id: string }>, res: Response) {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      const updatedCustomer = await customer.update(req.body);
      res.json(updatedCustomer);
    } else {
      res.status(404).send("Customer not found");
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
