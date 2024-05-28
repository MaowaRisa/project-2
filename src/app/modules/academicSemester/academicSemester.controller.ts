import { AcademicSemesterServices } from './academicSemester.service';
import { RequestHandler } from 'express';

import sendResponse from '../../utility/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utility/catchAsync';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is created successfully!',
    data: result,
  });
});
const getAllAcademicSemester: RequestHandler = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All academic semester retrieved successfully!',
    data: result,
  });
});
const getSingleAcademicSemester: RequestHandler = catchAsync(async(req, res) =>{
  const { academicSemesterId }= req.params;
  const result = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(academicSemesterId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester retrieved successfully!',
    data: result,
  })
})
const updateAcademicSemester : RequestHandler = catchAsync(async(req, res) =>{
  const { academicSemesterId } = req.params;
  const result =  await AcademicSemesterServices.updateAcademicSemesterIntoDB(academicSemesterId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester updated successfully!',
    data: result,
  })
}) 
export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester
};
