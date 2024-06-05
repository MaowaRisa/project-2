import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createStudentValidationSchema } from '../student/student.validation';
import { facultyValidationSchema } from '../faculty/faculty.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  validateRequest(facultyValidationSchema.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

export const UserRoutes = router;
