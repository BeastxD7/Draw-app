import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "./config";

declare global {
    namespace Express {
      export interface Request {
        userId: number;
      }
    }
  }

export const middleware = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers["authorization"];

    const decoded = jwt.verify(token as string , JWT_SECRET)

    if(decoded)  {
        req.userId = (decoded as jwt.JwtPayload).userId;
    }else{
        res.status(103).json({
            message:"Unauthorized"
        })
    }
    
}