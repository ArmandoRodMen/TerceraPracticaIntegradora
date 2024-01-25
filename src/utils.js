import {dirname, join} from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "./config.js";

export const __dirname = dirname(fileURLToPath(import.meta.url));

const SECRET_KEY_JWT = config.SECRET_KEY_JWT;

export const hashData= async(data)=>{
    return bcrypt.hash(data, 10);
};

export const compareData = async(data, hashedData)=>{
    return bcrypt.compare(data, hashedData);
};

export const generateToken = (user) =>{
    
    const token = jwt.sign(user, SECRET_KEY_JWT,{expiresIn: 300});
    return token;
}