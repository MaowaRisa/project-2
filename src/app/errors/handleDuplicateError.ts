/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericErrorResponse } from '../../interface/error';

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const regex = /{ name: "([^"]+)" }/;
  const extractedMessage = error.message.match(regex);
  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage[1]} is already exists`,
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};
export default handleDuplicateError;
