import { AcademicSemesterRoutes } from './../modules/academicSemester/academicSemester.route';
import { Router } from 'express';
import { UserRoutes } from '../modules/users/user.route';
import { StudentRoutes } from '../modules/student/student.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
];

moduleRoutes.map((route) => router.use(route.path, route.route));
// router.use('/users', UserRoutes);
// router.use('/students', StudentRoutes);

export default router;
