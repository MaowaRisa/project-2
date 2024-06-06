import { RequestHandler } from 'express';
import { StudentServices } from './student.service';
import { isEmpty } from '../../utility/utility';

import httpStatus from 'http-status';
import sendResponse from '../../utility/sendResponse';
import catchAsync from '../../utility/catchAsync';
import AppError from '../../errors/AppError';

const updateStudent: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;

  const updatedData = await StudentServices.updateStudentIntoDB(id, student);

  if (updatedData) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student successfully updated!',
      data: updatedData,
    });
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Update not successful!');
  }
});

// const updateStudent : RequestHandler = catchAsync(async(req, res)=>{

// })
const getAllStudents: RequestHandler = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrieved successfully',
    data: result,
  });
});
const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(id);

  if (!isEmpty(result)) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student retrieved successfully!',
      data: result,
    });
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'No match found!');
  }
});
const deleteStudent: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.deleteStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is deleted successfully',
    data: result,
  });
});
export const StudentControllers = {
  // createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
