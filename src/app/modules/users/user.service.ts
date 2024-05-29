import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generatedStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};
  // If password is not given, use default password
  userData.password = password || (config.default_password as string);
  // set student role
  userData.role = 'student';
  // // manually generated ID
  // userData.id = '20016521365';
  // Get Academic Semester information
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
  if (admissionSemester) {
    userData.id = await generatedStudentId(admissionSemester);
  } else {
    throw new Error('Academic semester mismatched!');
  }

  // create a user
  const newUser = await User.create(userData);

  // Create Student
  if (Object.keys(newUser).length) {
    payload.id = newUser.id;
    payload.user = newUser._id; // reference ID

    const newStudent = await Student.create(payload);
    return newStudent;
  }
};
export const UserServices = {
  createStudentIntoDB,
};
