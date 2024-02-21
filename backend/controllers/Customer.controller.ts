import { Request, Response } from "express";
import Customer from "../database/models/Customer.model";
import Region from "../database/models/Region.model";
import Contact from "../database/models/Contact.model";
import { ValidationError, Op } from "sequelize";
import Department from "../database/models/Department.model";

const modelFormat = {
  attributes: { exclude: ["regionId"] },
  include: [
    Region,
    {
      model: Contact,
      through: { attributes: [] },
    },
  ],
};

export default class CustomerController {
  static async getAllCustomers(req: Request, res: Response) {
    const customers = await Customer.findAll(modelFormat);
    res.json(customers);
  }

  static async searchCustomers(req: Request, res: Response) {
    const query = req.query.q?.toString();
    let customers;
    if (!query) {
      customers = await Customer.findAll(modelFormat);
    } else {
      customers = await Customer.findAll({
        ...modelFormat,
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
    }
    res.json(customers);
  }

  static async getCustomerById(req: Request<{ id: string }>, res: Response) {
    const customer = await Customer.findByPk(req.params.id, modelFormat);
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
      const contacts = req.body.contacts;
      if (contacts && Array.isArray(contacts)) {
        for (let contactData of contacts) {
          let contact;
          if (contactData.id) {
            contact = await Contact.findByPk(contactData.id);
            if (!contact) {
              return res.status(400).json({ error: "Contact not found." });
            }
          } else {
            if (contactData.department && contactData.department.id) {
              const department = await Department.findByPk(
                contactData.department.id
              );
              if (!department) {
                return res.status(400).json({ error: "Department not found." });
              }
              contactData.departmentId = department.id;
              delete contactData.department;
            } else contactData.departmentId = null;
            contact = await Contact.create(contactData);
          }
          await newCustomer.addContact(contact.id);
        }
      }
      return res.json(newCustomer);
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let attribute = "";
        for (let i = 0; i < error.errors.length; i++) {
          if (error.errors[i].path === "phone_number") {
            attribute = "Customer phone number";
          } else if (error.errors[i].path === "account_number") {
            attribute = "Customer account number";
          } else if (error.errors[i].path === "customer_code") {
            attribute = "Customer code";
          } else if (error.errors[i].path === "email") {
            attribute = "Contact email";
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
      const customer = await Customer.findByPk(req.params.id, modelFormat);
      if (!customer) {
        return res.status(400).json({ error: "Customer not found." });
      }
      const contacts = req.body.contacts;
      if (contacts && Array.isArray(contacts)) {
        if (
          contacts.length === 1 &&
          (contacts[0].id === null || !("id" in contacts[0]))
        ) {
          if (contacts[0].department && contacts[0].department.id) {
            const department = await Department.findByPk(
              contacts[0].department.id
            );
            if (!department) {
              return res.status(400).json({ error: "Department not found." });
            }
            contacts[0].departmentId = department.id;
            delete contacts[0].department;
          } else contacts[0].departmentId = null;
          const contact = await Contact.create(contacts[0]);
          await customer.addContact(contact.id);
        } else {
          const oldContactIds =
            customer.contacts?.map((contact: Contact) => contact.id) ?? [];
          const newContactIds = req.body.contacts.map(
            (contact: Contact) => contact.id
          );
          for (let id of newContactIds) {
            const contact = await Contact.findByPk(id);
            if (!contact) {
              return res.status(400).json({ error: "Contact not found." });
            }
          }
          const contactIdsToDelete = oldContactIds.filter(
            (id) => !newContactIds.includes(id)
          );
          const contactIdsToAdd = newContactIds.filter(
            (id: bigint) => !oldContactIds.includes(id)
          );
          for (let id of contactIdsToDelete) {
            await customer.removeContact(id);
          }
          for (let id of contactIdsToAdd) {
            await customer.addContact(id);
          }
        }
      }
      await customer.update(req.body);
      return res.json(customer);
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let attribute = "";
        for (let i = 0; i < error.errors.length; i++) {
          if (error.errors[i].path === "phone_number") {
            attribute = "Phone number";
          } else if (error.errors[i].path === "account_number") {
            attribute = "Account number";
          } else if (error.errors[i].path === "customer_code") {
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
