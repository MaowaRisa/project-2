import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../utility/sendResponse';
import { CourseServices } from './course.service';

const createCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully!',
    data: result,
  });
});
const getAllCourses: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All courses retrieved successfully!',
    data: result,
  });
});
const getSingleCourse: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course retrieved successfully!',
    data: result,
  });
});
const updateCourse: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully!',
    data: result,
  });
});
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});
const assignFacultiesWithCourse: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFacultiesWithCourseIntoDB(id, faculties);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties with courses updated successfully!',
    data: result,
  });
});
const removeFacultiesWithCourse: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFacultiesWithCourseIntoDB(id, faculties);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties with courses removed successfully!',
    data: result,
  });
});
export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourse,
  removeFacultiesWithCourse
};
