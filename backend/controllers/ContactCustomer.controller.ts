import { Request, Response } from "express";
import ContactCustomer from "../database/models/ContactCustomer.model";
import Contact from "../database/models/Contact.model";
import Customer from "../database/models/Customer.model";

const modelFormat = {
  attributes: { exclude: ["contactId", "customerId"] },
  include: [Contact, Customer],
};

export default class UserController {
  static async getAllContactCustomers(req: Request, res: Response) {
    const contactCustomers = await ContactCustomer.findAll(modelFormat);
    res.json(contactCustomers);
  }

  static async getContactCustomerById(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const contacttCustomer = await ContactCustomer.findByPk(
      req.params.id,
      modelFormat
    );
    if (contacttCustomer) {
      res.json(contacttCustomer);
    } else {
      res.status(404).send("Contact Customer not found");
    }
  }
}
