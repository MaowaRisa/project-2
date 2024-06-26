import express from 'express';
import { OfferedCoursesControllers } from './offeredCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { offeredCourseValidations } from './offeredCourse.validation';

const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidations.createOfferedCourseValidationSchema),
  OfferedCoursesControllers.createOfferedCourse,
);
router.get('/', OfferedCoursesControllers.getAllOfferedCourses);
router.get('/:id', OfferedCoursesControllers.getSingleOfferedCourses);

router.patch(
  '/:id',
  validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCoursesControllers.updateOfferedCourse,
);
router.delete('/:id', OfferedCoursesControllers.deleteOfferedCourses);
export const offeredCourseRoutes = router;
