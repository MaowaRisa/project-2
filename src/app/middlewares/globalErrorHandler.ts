/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../../interface/error';
import config from '../config';
import { handleZodError } from '../errors/handleZodError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Setting default values
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Something went wrong!';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];
  

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === 'development' && error.stack,
    // error: error,
  });
  next();
};

// Pattern
/*
success
message
errorSources:[
  path: '',
  message: ''
]
stack
*/

export default globalErrorHandler;
