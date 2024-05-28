import { Request, RequestHandler, Response, NextFunction } from 'express';

// HOF For catching the error in handling promises
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
