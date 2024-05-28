import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validation check
      await schema.parseAsync({ body: req.body });
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default validateRequest;
