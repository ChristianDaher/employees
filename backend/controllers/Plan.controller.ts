import { Request, Response } from "express";
import Plan from "../database/models/Plan.model";
import User from "../database/models/User.model";
import ContactCustomer from "../database/models/ContactCustomer.model";
import Contact from "../database/models/Contact.model";
import Customer from "../database/models/Customer.model";
import Department from "../database/models/Department.model";
import Region from "../database/models/Region.model";
import { ValidationError, Op, fn, col } from "sequelize";
import sequelize from "../database/sequelize";


const modelFormat = {
  attributes: { exclude: ["userId", "contactCustomerId"] },
  include: [
    {
      model: User,
      attributes: { exclude: ["password"] },
    },

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
    const page = req.query.page?.toString();
    const fromDateString = req.query.fromDate?.toString();
    const toDateString =req.query.toDate?.toString();
    console.log('FROM DATE STRING  , TO DATE STRING  : ', fromDateString, toDateString)

    let fromDate = undefined
    let toDate = undefined
    if (!isNaN(Date.parse(fromDateString||''))) {
      const localDate = new Date(fromDateString || '');
      const timezoneOffset = localDate.getTimezoneOffset() * 60000;
      fromDate = new Date(localDate.getTime() - timezoneOffset);
    }
    if (!isNaN(Date.parse(toDateString||''))) {
      const localDate = new Date(toDateString || '');
      const timezoneOffset = localDate.getTimezoneOffset() * 60000;
      toDate = new Date(localDate.getTime() - timezoneOffset);
    }

    console.log('FROM DATE , TO DATE : ', fromDate, toDate)

    let dateFormate = {}
    if(fromDate != undefined && toDate != undefined){
      dateFormate = {
        date: {
          [Op.and]: {
            [Op.gte]: new Date(fromDate), 
            [Op.lte]: new Date(toDate), 
          }
          
        },
      }
    }
    else if(fromDate != undefined){
      dateFormate = {
        date: {
          [Op.gte]: new Date(fromDate), 
        },
      }
    }

    console.log('DATE FORMATE ', dateFormate)

    var queryFormat = {}
    if(query !=''){
      queryFormat={[Op.or]: {
        how: {
          [Op.like]: `%${query}%`,
        },
        objective: {
          [Op.like]: `%${query}%`,
        },
        output: {
          [Op.like]: `%${query}%`,
        },
        offer: {
          [Op.like]: `%${query}%`,
        },
        meeting: {
          [Op.like]: `%${query}%`,
        },
        note: {
          [Op.like]: `%${query}%`,
        },
        "$user.first_name$": {
          [Op.like]: `%${query}%`,
        },
        "$user.last_name$": {
          [Op.like]: `%${query}%`,
        },
        
        [Op.or]: [
          sequelize.where(
            fn('concat', col('User.first_name'), ' ', col('User.last_name')),
            {
              [Op.like]: `%${query}%`
            }
          ),
          sequelize.where(
            fn('concat', col('ContactCustomer.Contact.first_name'), ' ', col('ContactCustomer.Contact.last_name')),
            {
              [Op.like]: `%${query}%`
            }
          ),
        ],
 
        "$contactCustomer.contact.first_name$": {
          [Op.like]: `%${query}%`,
        },
        "$contactCustomer.contact.last_name$": {
          [Op.like]: `%${query}%`,
        },
        "$contactCustomer.customer.name$": {
          [Op.like]: `%${query}%`,
        },
      },}
    }

    var pageFormat = {}
    if(page == 'reports'){
      pageFormat={
        status: {
          [Op.in]: ['Completed', 'Cancelled']
        },
      }
    }
    else{
      pageFormat={
        status: {
          [Op.in]: ['Postponed', 'Pending']
        },
      }
    }

    console.log("QUERY FORMAT : ", queryFormat)

    let plans;
  
      plans = await Plan.findAll({
        ...modelFormat,
        where: {
          ...dateFormate,
          ...queryFormat,
          ...pageFormat,
        },
      });
    
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
    try {
      // if (req.body.user && req.body.user.id) {
      //   const user = await User.findByPk(req.body.user.id);
      //   if (!user) {
      //     return res.status(400).json({ error: "User not found." });
      //   }
      //   req.body.userId = user.id;
      //   delete req.body.user;
      // } else req.body.userId = null;
      console.log("REQ USER FROM AUTH : ", req.user)
      if (!req.user) {
        return res.status(400).json({ error: "User not found." });
      }else{
        req.body.userId = req.user.id
        delete req.body.user
      }
      if (req.body.contactCustomer && req.body.contactCustomer.id) {
        const contactCustomer = await ContactCustomer.findByPk(
          req.body.contactCustomer.id
        );
        if (!contactCustomer) {
          return res.status(400).json({ error: "ContactCustomer not found." });
        }
        req.body.contactCustomerId = contactCustomer.id;
        delete req.body.contactCustomer;
      }
      const newPlan = await Plan.create(req.body);
      return res.json(newPlan);
    } catch (error) {
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }

  static async updatePlan(req: Request<{ id: string }>, res: Response) {
    try {
      // if (req.body.user && req.body.user.id) {
      //   const user = await User.findByPk(req.body.user.id);
      //   if (!user) {
      //     return res.status(400).json({ error: "User not found." });
      //   }
      //   req.body.userId = user.id;
      //   delete req.body.user;
      // } else req.body.userId = null;
      if (!req.user) {
        return res.status(400).json({ error: "User not found." });
      }else{
        req.body.userId = req.user.id
        delete req.body.user
      }
      if (req.body.contactCustomer && req.body.contactCustomer.id) {
        const contactCustomer = await ContactCustomer.findByPk(
          req.body.contactCustomer.id
        );
        if (!contactCustomer) {
          return res.status(400).json({ error: "ContactCustomer not found." });
        }
        req.body.contactCustomerId = contactCustomer.id;
        delete req.body.contactCustomer;
      }
      const plan = await Plan.findByPk(req.params.id);
      if (plan) {
        const updatedPlan = await plan.update(req.body);
        res.json(updatedPlan);
      } else {
        res.status(404).send("Plan not found");
      }
    } catch (error) {
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
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
