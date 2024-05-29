import { RequestHandler } from "express"
import catchAsync from "../../utility/catchAsync"
import sendResponse from "../../utility/sendResponse";
import httpStatus from "http-status";
import { AcademicDepartmentServices } from "./academicDepartment.service";

const createAcademicDepartment: RequestHandler = catchAsync(async(req, res)=>{
    const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic department created successfully!',
        data: result
    })
});
const getAllAcademicDepartment: RequestHandler = catchAsync(async(req, res)=>{
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All academic department retrieved successfully!',
        data: result
    })
})
const getSingleAcademicDepartment : RequestHandler = catchAsync(async(req, res) =>{
    const {academicDepartmentId} = req.params;
    console.log('Department Id', academicDepartmentId);
    const result = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(academicDepartmentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Department retrieved successfully!",
        data: result
    })
})
const updateAcademicDepartment: RequestHandler = catchAsync(async(req, res)=>{
    const {academicDepartmentId} = req.params;
    const result = await AcademicDepartmentServices.updateAcademicDepartmentIntoDB
    (academicDepartmentId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true, 
        message: 'Academic department updated successfully!',
        data: result
    })
})
export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartment,
    getSingleAcademicDepartment,
    updateAcademicDepartment
}