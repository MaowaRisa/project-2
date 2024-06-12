import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import { AuthServices } from "./auth.sevice";
import sendResponse from "../../utility/sendResponse";
import httpStatus from "http-status";

const loginUser : RequestHandler = catchAsync(async(req, res) => {
    const result = await AuthServices.loginUser(req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successfully',
        data: result
    })
})
export const AuthControllers = {
    loginUser,
}