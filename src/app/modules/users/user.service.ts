import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generatedStudentId } from './user.utils';
import mongoose from 'mongoose';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};
  // If password is not given, use default password
  userData.password = password || (config.default_password as string);
  // set student role
  userData.role = 'student';

  // Get Academic Semester information
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (admissionSemester) {
      userData.id = await generatedStudentId(admissionSemester);
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Academic semester mismatched!',
      );
    }

    // create a user
    const newUser = await User.create([userData], { session });

    // Create Student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference ID

    const newStudent = await Student.create([payload], {session});

  if(!newStudent.length){
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student")
  }
  await session.commitTransaction();
  await session.endSession();
    return newStudent;
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
  }
};
export const UserServices = {
  createStudentIntoDB,
};
