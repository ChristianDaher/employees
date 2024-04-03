import { NextFunction, Request, Response } from "express";

import { parseToken } from "../utils/tokens.utils";
import Token from "../database/models/Token.model";
import User from "../database/models/User.model";


// add the user prop to the request
declare module "express-serve-static-core" {
  interface Request { user?: {
    id: bigint;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    departmentId?: bigint;
    password?: string;
    active?:boolean;
  } }
}

function Authenticate(userRoles: number[] = []) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('MIDDLEWARE RUN')
      console.log('headers : ', req.headers.authorization)
      let rawToken = req.headers.authorization?.split(' ')[1]
      console.log('RAW TOKEN ' , rawToken)
      const token = await parseToken(rawToken || "");
      console.log('token header is : ' , token)

      if (typeof token == "string") return res.status(400).send({ error: "Invalid token" });
      console.log('token is string')

      if (!token.user_id) return res.status(401).send({ error: "Not Authorized." });
      console.log('token user id:  ', token.user_id)

      // get token from db
      let dbToken = await Token.findOne({
        where: {
          token: rawToken, user_id: token.user_id,
          expiry_date: token.expiry_date
        },
      });
      if (!dbToken) return res.status(401).send({ error: "Not Authorized." });

      // check expiration date
      if (new Date() > dbToken.expiry_date)
        return res.status(401).send({ error: "Not Authorized." });

      // find the user
      let user = await User.findOne({ where: { id: token.user_id, active: true }, attributes:{exclude:["password"]} });
      if (!user) return res.status(401).send({ error: "Not Authorized." });

      req.user = user;

      next();
    } catch (error) {
      return res.status(401).send({ error: "Not Authorized." });
    }
  }
}

export { Authenticate }