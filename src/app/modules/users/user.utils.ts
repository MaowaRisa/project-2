import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';
const findLastStudentId = async (searchExistingId: string) => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
      id: { $regex: `^${searchExistingId}` },
    },
    {
      id: 1,
      _id: 0,
    },
  );
  return lastStudent?.id ? lastStudent.id : undefined;
};
export const generatedStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString(); // by default
  const searchExistingId = payload.year + payload.code;

  const lastStudentId = await findLastStudentId(searchExistingId);

  if (lastStudentId) {
    currentId = lastStudentId.substring(6);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};
