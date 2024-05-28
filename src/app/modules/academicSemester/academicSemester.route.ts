import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSchemaValidations } from '../academicSemester/academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(AcademicSchemaValidations.createAcademicValidationSchema),
  AcademicSemesterControllers.createAcademicSemester,
);
router.get('/', AcademicSemesterControllers.getAllAcademicSemester);
router.get(
  '/academicSemesterId',
  AcademicSemesterControllers.getSingleAcademicSemester,
);
router.patch(
  '/:academicSemesterId',
  validateRequest(
    AcademicSchemaValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
);
export const AcademicSemesterRoutes = router;
