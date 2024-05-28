import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utility/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utility/catchAsync';

const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully!',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};
