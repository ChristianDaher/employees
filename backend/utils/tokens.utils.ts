import test from "node:test";
import Token from "../database/models/Token.model";

require("dotenv").config();
const jwt = require('jsonwebtoken')

function getJWTKey() {
  let key: string;

  if (process.env.JWT_SECRET_KEY) key = process.env.JWT_SECRET_KEY;
  else {
    key = "backup_key"; 
  }

  return key;
}

async function createToken(user_id: bigint, tokenData={}, token_expiry_m=10000) {
  let now = new Date();
  const expiry_date = new Date(now.setMinutes(now.getMinutes() + token_expiry_m));

  const token = jwt.sign({ user_id, expiry_date, ...tokenData}, getJWTKey());

  await Token.create({ user_id, expiry_date, token });

  return { token, expiry_date };
}

async function parseToken(token: string) {
  console.log("parsing token")
  let test = await jwt.verify(token, getJWTKey());

  return test
}

export { createToken, parseToken }