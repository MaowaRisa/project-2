// import { TStudent } from './student.interface';
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../users/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constants';
import { TStudent } from './student.interface';

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

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  // const result = await Student.findOneAndUpdate({ id: id }, studentData, {
  //   new: true,
  // });
  // //// console.log(result)
  // return result;
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
    guardain: {
      fatherOccupation:"Teacher"
    }

    guardian.fatherOccupation = Teacher

    name.firstName = 'Maowa'
    name.lastName = 'Risa'
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // console.log('base query', query)
  // const queryObj = { ...query };
  // // {email: {$regex: query.searchTerm, $options: i}}
  // // {presentAddress: {$regex: query.searchTerm, $options: i}}
  // // {name.firstName: {$regex: query.searchTerm, $options: i}}
  // // console.log(query.searchTerm)
  // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }
  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });
  // // filtering
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // //// console.log({query, queryObj})
  // //// const result = await Student.find()
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  // let sort = '-createdAt';
  // if(query.sort){
  //   sort = query.sort as string;
  // }
  // //// console.log('sort',sort)
  // const sortQuery = filterQuery.sort(sort);

  // let page = 1;
  // let limit = 1;
  // let skip = 0;
  // if(query.limit){
  //   limit = Number(query.limit);
  // }
  // if(query.page){
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }
  // const paginateQuery = sortQuery.skip(skip);
  // const limitQuery = paginateQuery.limit(limit);

  // // field limiting // query object = {fields: "name,email"}
  // // localhost:5009/api/v1/students?fields=name,email // minus for skip
  // let fields = '-__v'; // minus
  // if(query.fields){
  //   fields = (query.fields as string).split(',').join(' ');
  // }
  ////// console.log(fields)
  // const fieldsQuery = await limitQuery.select(fields)
  // return fieldsQuery;

  // refactor QueryBuilder

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.aggregate([{ $match: { id: id } }]);
  const result = await Student.findById(id)
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
    if(!result){
      throw new AppError(httpStatus.NOT_FOUND, "Student not found!")
    }
  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  if (!(await Student.isUserExist(id))) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found or already removed!',
    );
  }
  try {
    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }
    const deleteUser = await User.findByIdAndUpdate(
      id,
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
