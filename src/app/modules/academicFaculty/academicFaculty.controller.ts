import { RequestHandler } from "express"
import catchAsync from "../../utility/catchAsync"
import { AcademicFacultyServices } from "./academicFaculty.service"
import sendResponse from "../../utility/sendResponse";
import httpStatus from "http-status";

const createAcademicFaculty: RequestHandler = catchAsync(async(req, res)=>{
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic faculty created successfully!',
        data: result
    })
});
const getAllAcademicFaculty: RequestHandler = catchAsync(async(req, res)=>{
    const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All academic faculty retrieved successfully!',
        data: result
    })
})
const getSingleAcademicFaculty : RequestHandler = catchAsync(async(req, res) =>{
    const {academicFacultyId} = req.params;
    console.log('faculty Id', academicFacultyId);
    const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(academicFacultyId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic faculty retrieved successfully!",
        data: result
    })
})
const updateAcademicFaculty: RequestHandler = catchAsync(async(req, res)=>{
    const {academicFacultyId} = req.params;
    const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB
    (academicFacultyId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true, 
        message: 'Academic faculty updated successfully!',
        data: result
    })
})
export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculty,
    getSingleAcademicFaculty,
    updateAcademicFaculty
}