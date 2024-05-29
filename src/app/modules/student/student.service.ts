// import { TStudent } from './student.interface';
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../users/user.model';

// const createStudentIntoDB = async (studentData: TStudent) => {
//   // Built in static method
//   if (await Student.isUserExist(studentData.id)) {
//     throw new Error('User already exist!');
//   }
//   const result = await Student.create(studentData);

//   // Instance method
//   // const student = new Student(studentData);
//   // // student.save()
//   // // Check with custom instance method
//   // if(await student.isUserExist(studentData.id)){
//   //   throw new Error("User already exist!")
//   // }
//   // const result = await student.save(); // built in instance method - provided by mongoose

//   return result;
// };

const updateStudentIntoDB = async (id: string, studentData: object) => {
  const result = await Student.findOneAndUpdate({ id: id }, studentData, {
    new: true,
  });
  // console.log(result)
  return result;
};
const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  return result;
};
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.aggregate([{ $match: { id: id } }]);
  const result = await Student.findOne({ id: id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  if(!(await Student.isUserExist(id))){
    throw new AppError(httpStatus.NOT_FOUND, "User not found or already removed!")
  }
  try {
    session.startTransaction();
   
    const deletedStudent = await Student.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }
    const deleteUser = await User.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};
export const StudentServices = {
  // createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
