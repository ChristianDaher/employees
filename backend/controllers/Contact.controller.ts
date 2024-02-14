import { Request, Response } from "express";
import Contact from "../database/models/Contact.model";
import Department from "../database/models/Department.model";
import Customer from "../database/models/Customer.model";
import { ValidationError, Op } from "sequelize";

const modelFormat = {
  attributes: { exclude: ["departmentId"] },
  include: [
    Department,
    {
      model: Customer,
      through: { attributes: [] },
    },
  ],
};

export default class ContactController {
  static async getAllContacts(req: Request, res: Response) {
    const contacts = await Contact.findAll(modelFormat);
    res.json(contacts);
  }

  static async searchContacts(req: Request, res: Response) {
    const query = req.query.q?.toString();
    let contacts;
    if (!query) {
      contacts = await Contact.findAll(modelFormat);
    } else {
      contacts = await Contact.findAll({
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
              title: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              note: {
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
    res.json(contacts);
  }

  static async getContactById(req: Request<{ id: string }>, res: Response) {
    const contact = await Contact.findByPk(req.params.id, modelFormat);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).send("Contact not found");
    }
  }

  static async createContact(req: Request, res: Response) {
    try {
      if (req.body.department && req.body.department.id) {
        const department = await Department.findByPk(req.body.department.id);
        if (!department) {
          return res.status(400).json({ error: "Department not found." });
        }
        req.body.departmentId = department.id;
        delete req.body.department;
      } else req.body.departmentId = null;
      const newContact = await Contact.create(req.body);
      return res.json(newContact);
    } catch (error) {
      console.log(error);
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: "Email must be unique." });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }

  static async updateContact(req: Request<{ id: string }>, res: Response) {
    try {
      if (req.body.department && req.body.department.id) {
        const department = await Department.findByPk(req.body.department.id);
        if (!department) {
          return res.status(400).json({ error: "Department not found." });
        }
        req.body.departmentId = department.id;
        delete req.body.department;
      } else req.body.departmentId = null;
      const contact = await Contact.findByPk(req.params.id);
      if (contact) {
        const updatedContact = await contact.update(req.body);
        res.json(updatedContact);
      } else {
        res.status(404).send("Contact not found");
      }
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: "Email must be unique." });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
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
