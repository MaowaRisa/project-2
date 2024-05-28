import { TStudent } from './student.interface';
import { Student } from './student.model';

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
  const result = await Student.find();

  return result;
};
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};
export const StudentServices = {
  // createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
