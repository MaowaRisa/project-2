import express from 'express';
import { FacultyController } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidationSchema } from './faculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';

const router = express.Router();

// get all faculties
router.get('/',auth(USER_ROLE.admin, USER_ROLE.faculty), FacultyController.getAllFaculties);
// get single faculty
router.get('/:id', FacultyController.getSingleFaculty);
// update faculty
router.patch(
  '/:id',
  validateRequest(facultyValidationSchema.updateFacultyValidationSchema),
  FacultyController.updateFaculty,
);
router.delete('/:id', FacultyController.deleteFaculty)

export const FacultyRoutes = router;
