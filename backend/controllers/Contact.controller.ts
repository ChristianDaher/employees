import { Request, Response } from "express";
import Contact from "../database/models/Contact.model";
import Department from "../database/models/Department.model";
import Customer from "../database/models/Customer.model";
import { ValidationError, Op } from "sequelize";
import Region from "../database/models/Region.model";

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
      const customers = req.body.customers;
      if (customers && Array.isArray(customers)) {
        for (let customerData of customers) {
          let customer;
          if (customerData.id) {
            customer = await Customer.findByPk(customerData.id);
            if (!customer) {
              return res.status(400).json({ error: "Customer not found." });
            }
          } else {
            if (customerData.region && customerData.region.id) {
              const region = await Region.findByPk(customerData.region.id);
              if (!region) {
                return res.status(400).json({ error: "Region not found." });
              }
              customerData.regionId = region.id;
              delete customerData.region;
            } else customerData.regionId = null;
            customer = await Customer.create(customerData);
          }
          await newContact.addCustomer(customer.id);
        }
      }
      return res.json(newContact);
    } catch (error) {
      if (
        error instanceof ValidationError &&
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: "Contact email must be unique." });
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
      const contact = await Contact.findByPk(req.params.id, modelFormat);
      if (!contact) {
        return res.status(400).json({ error: "Contact not found." });
      }
      const customers = req.body.customers;
      if (customers && Array.isArray(customers)) {
        if (
          customers.length === 1 &&
          (customers[0].id === null || !("id" in customers[0]))
        ) {
          if (customers[0].region && customers[0].region.id) {
            const region = await Region.findByPk(customers[0].region.id);
            if (!region) {
              return res.status(400).json({ error: "Region not found." });
            }
            customers[0].regionId = region.id;
            delete customers[0].region;
          } else customers[0].regionId = null;
          const customer = await Customer.create(customers[0]);
          await contact.addCustomer(customer.id);
        } else {
          const oldCustomerIds =
            contact.customers?.map((customer: Customer) => customer.id) ?? [];
          const newCustomerIds = req.body.customers.map(
            (customer: Customer) => customer.id
          );
          for (let id of newCustomerIds) {
            const customer = await Customer.findByPk(id);
            if (!customer) {
              return res.status(400).json({ error: "Customer not found." });
            }
          }
          const customerIdsToDelete = oldCustomerIds.filter(
            (id) => !newCustomerIds.includes(id)
          );
          const customerIdsToAdd = newCustomerIds.filter(
            (id: bigint) => !oldCustomerIds.includes(id)
          );
          for (let id of customerIdsToDelete) {
            await contact.removeCustomer(id);
          }
          for (let id of customerIdsToAdd) {
            await contact.addCustomer(id);
          }
        }
      }
      await contact.update(req.body);
      return res.json(contact);
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
