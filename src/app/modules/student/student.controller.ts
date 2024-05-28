import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StudentServices } from './student.service';
// import studentValidationSchema from './student.joi.validation';
import { updateStudentValidationSchema } from './student.validation';
import { isEmpty } from '../../utility/utility';

import httpStatus from 'http-status';
import sendResponse from '../../utility/sendResponse';
import catchAsync from '../../utility/catchAsync';

const updateStudent: RequestHandler = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const studentData = req.body;

  const validatedData = updateStudentValidationSchema.parse(studentData);

  const updatedData = await StudentServices.updateStudentIntoDB(
    studentId,
    validatedData,
  );

  if (updatedData) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student successfully updated!',
      data: updatedData,
    });
  } else {
    throw new Error('Update not successful!');
  }
});
const getAllStudents: RequestHandler = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrieved successfully',
    data: result,
  });
});
const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);

  if (!isEmpty(result)) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student retrieved successfully!',
      data: result,
    });
  } else {
    throw new Error('No match found!');
  }
});
const deleteStudent: RequestHandler = catchAsync(async (req, res) => {
  const { studentId } = req.params;

  const result = await StudentServices.deleteStudentFromDB(studentId);

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
