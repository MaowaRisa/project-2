import httpStatus from 'http-status';
import { AdminServices } from './admin.service';
import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import sendResponse from '../../utility/sendResponse';
import AppError from '../../errors/AppError';

const getSingleAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is retrieved successfully',
    data: result,
  });
});

const getAllAdmins: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins are retrieved successfully',
    data: result,
  });
});

const updateAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;

  const result = await AdminServices.updateAdminIntoDB(id, admin);
    if(result){
        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Admin is updated successfully',
          data: result,
        });
    }else{
        throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong.")
    }
});

const deleteAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdminFromDB(id);
  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin is deleted successfully',
      data: null,
    });
  }else{
    throw new AppError(httpStatus.BAD_REQUEST, "Delete is not successful!")
  }
});

export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
};
