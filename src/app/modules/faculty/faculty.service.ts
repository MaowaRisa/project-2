/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { TFaculty } from './faculty.interface';
import Faculty from './faculty.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../users/user.model';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(Faculty.find(), query);
  const facultyData = await facultyQuery.modelQuery;
  return facultyData;
};
const getSingleFacultyFromDB = async (id: string) => {
  const result = Faculty.findById(id);
  return result;
};
const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(
    id,
    modifiedUpdatedData,
    { new: true },
  );

  return result;
};
const deleteFacultyFromDB = async(id: string)=>{
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deleteFaculty = await Faculty.findByIdAndUpdate(id, {isDeleted: true}, {new: true, session});
  
    if(!deleteFaculty){
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty');
    }

    const userId = deleteFaculty.user;

    const deletedUser = await User.findByIdAndUpdate(userId, {isDeleted: true}, {new: true, session});

    if(!deletedUser){
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user")
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteFaculty;

  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error)
  }
}

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB
};
