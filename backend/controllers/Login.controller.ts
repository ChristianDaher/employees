import { Request, Response } from "express";
import User from "../database/models/User.model";
import Department from "../database/models/Department.model";
import { createToken } from "../utils/tokens.utils";

const bcrypt = require('bcrypt');


export default class LoginController {
  static async validateCredentials(req: Request, res: Response) {

    try {
        console.log(req.body)
        const user = await User.findOne({
          where: { email: req?.body?.email }
        });
    
        console.log(user)
        if (!user) {
          res.status(401).send({message: "User not found"})
          return
        }
    
        const isPasswordValid = await bcrypt.compare(req.body.password, user?.password);
    
        if (isPasswordValid) {
          let userToken = await createToken(user.id)
          res.status(200).send(userToken)
        } else {
          res.status(401).send({message: "Incorrect Password"})
        }
        
      } catch (error) {
        console.error('Error finding user:', error);
        throw error;
      }
  }
}
