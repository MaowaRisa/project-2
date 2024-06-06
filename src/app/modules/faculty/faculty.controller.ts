import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import { FacultyServices } from './faculty.service';
import sendResponse from '../../utility/sendResponse';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const getAllFaculties: RequestHandler = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultiesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All faculties retrieved successfully!',
    data: result,
  });
});
const getSingleFaculty: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty retrieved successfully!',
    data: result,
  });
});
const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;

  const result = await FacultyServices.updateFacultyIntoDB(id, faculty);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty successfully updated!',
      data: result,
    });
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Update not successful!');
  }
});
const deleteFaculty = catchAsync( async( req, res) =>{
  const {id} = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(id);

  if(result){
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty deleted successfully!',
      data: null,
    });
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Delete is not successful!');
  }
})
export const FacultyController = {
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty
};
