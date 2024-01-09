import { Request, Response } from "express";
import Contact from "../database/models/Contact.model";
import Department from "../database/models/Department.model";
import Customer from "../database/models/Customer.model";

export default class ContactController {
  static async getAllContacts(req: Request, res: Response) {
    const contacts = await Contact.findAll({
      include: [Department, Customer],
    });
    res.json(contacts);
  }

  static async getContactById(req: Request<{ id: string }>, res: Response) {
    const contact = await Contact.findByPk(req.params.id, {
      include: [Department, Customer],
    });
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).send("Contact not found");
    }
  }

  static async createContact(req: Request, res: Response) {
    const newContact = await Contact.create(req.body);
    res.json(newContact);
  }

  static async updateContact(req: Request<{ id: string }>, res: Response) {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      const updatedContact = await contact.update(req.body);
      res.json(updatedContact);
    } else {
      res.status(404).send("Contact not found");
    }
  }

  static async deleteContact(req: Request<{ id: string }>, res: Response) {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      await contact.destroy();
      res.status(204).send();
    } else {
      res.status(404).send("Contact not found");
    }
  }
}
