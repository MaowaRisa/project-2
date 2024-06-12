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
const getSingleOfferedCourses: RequestHandler = catchAsync(async(req, res)=>{
    const { id } = req.params;
    const result = await OfferedServices.getSingleOfferedCoursesFromDB(id);
    if(result){
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Successfully retrieved offered course!',
            data: result
        })
    }
});

const updateOfferedCourse: RequestHandler = catchAsync(async(req, res)=>{
    const {id} = req.params;
    const result = await OfferedServices.updateOfferedCourseIntoDB(id, req.body);
    if(result){
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Successfully offered course update!',
            data: result
        })
    }else{
        sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: 'Unsuccessfully for operation for offered course update!',
            data: result
        })
    }
});

const deleteOfferedCourses: RequestHandler = catchAsync(async(req, res)=>{
    const { id } = req.params;
    const result = await OfferedServices.deleteOfferedCoursesFromDB(id);
    if(result){
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Successfully deleted offered course!',
            data: null
        })
    }else{
        sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Unsuccessful delete operation!",
            data: result
        })
    }
});

export const OfferedCoursesControllers = {
    createOfferedCourse,
    getAllOfferedCourses,
    updateOfferedCourse,
    getSingleOfferedCourses,
    deleteOfferedCourses
}