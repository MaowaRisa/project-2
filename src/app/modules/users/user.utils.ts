import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { Student } from '../student/student.model';
import { User } from './user.model';
const lastStudentId = async() =>{
  const lastStudent = await User.findOne({
    role: 'student'
  },{
    id: 1,
    _id: 0
  })
  .sort({
    createdAt : -1
  })
  .lean();
  return Number(lastStudent?.id ? lastStudent.id.substring(6) : 0)
}
export const generatedStudentId = async(payload: TAcademicSemester) => {
  console.log(await lastStudentId())
  const currentId = await lastStudentId() || 0;
  let incrementId = (currentId + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

