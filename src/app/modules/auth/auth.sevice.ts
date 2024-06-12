import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../users/user.model';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (payload: TLoginUser) => {
  // check if the user exists
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!');
  }
  // checking if the user is already deleted
  // const isDeleted =  isUserExists?.isDeleted;

  if (user.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is already deleted or moved!',
    );
  }
  // // checking if the user is blocked
  // const userStatus =  isUserExists?.status;
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
  }
  // // checking if the password is correct
  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong credentials!');
  }
  // token generate and send to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role
  }
  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,{
        expiresIn: '10d'
    }
  );
  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange
  };
};
export const AuthServices = {
  loginUser,
};
