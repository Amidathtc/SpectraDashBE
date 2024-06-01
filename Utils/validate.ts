import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { HTTPCODES } from "../Utils/MainAppError";


export default (Schema: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = Schema.validate(req.body);
    if (error) {
      return res.status(HTTPCODES.BAD_REQUEST).json({
        message: "Validation Error",
        data: error.message,
      });
    } else {
      next();
    }
  };
};