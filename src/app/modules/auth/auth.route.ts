import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.student, USER_ROLE.faculty),
  validateRequest(authValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);
router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const authRoutes = router;
