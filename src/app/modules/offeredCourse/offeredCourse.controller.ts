import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import { OfferedServices } from "./offeredCourse.service";
import sendResponse from "../../utility/sendResponse";
import httpStatus from "http-status";

const createOfferedCourse: RequestHandler = catchAsync(async(req, res)=>{
    const result = await OfferedServices.createOfferedCourseIntoDB(req.body);
    if(result){
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Successfully offered course created!',
            data: result
        })
    }else{
        sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: 'Unsuccessfully for operation for offered course creation!',
            data: result
        })
    }
});
const getAllOfferedCourses: RequestHandler = catchAsync(async(req, res)=>{
    const result = await OfferedServices.getAllOfferedCoursesFromDB(req.query);
    if(result){
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Successfully retrieved offered course!',
            data: result
        })
    }
});

export const OfferedCoursesControllers = {
    createOfferedCourse,
    getAllOfferedCourses
}