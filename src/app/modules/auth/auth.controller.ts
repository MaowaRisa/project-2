import { RequestHandler } from "express";
import catchAsync from "../../utility/catchAsync";
import { AuthServices } from "./auth.sevice";
import sendResponse from "../../utility/sendResponse";
import httpStatus from "http-status";
import config from "../../config";

const loginUser : RequestHandler = catchAsync(async(req, res) => {
    const result = await AuthServices.loginUser(req.body)
    const {refreshToken, accessToken, needsPasswordChange} = result;
    res.cookie('refreshToken', refreshToken,{
        secure: config.node_env === 'production',
        httpOnly:true // con not modify by javascript 
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successfully',
        data: {
            accessToken,
            needsPasswordChange
        }
    })
})
const changePassword : RequestHandler = catchAsync(async(req, res) => {
    
    const {...passwordData} = req.body
    const result = await AuthServices.changePassword(req.user,passwordData)
    if(result){
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Password changed successfully',
            data: null,
        })
    }
})
const refreshToken : RequestHandler = catchAsync(async(req, res) => {
    const {refreshToken} = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken)
    if(result){
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Access token retrieved successfully',
            data: result,
        })
    }
})
export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken
}