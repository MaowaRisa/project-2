import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../users/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';

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
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // check if the user exists
  const user = await User.isUserExistsByCustomId(userData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found!');
  }
  // checking if the user is already deleted
  if (user.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is already deleted or moved!',
    );
  }
  // // checking if the user is blocked
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
  }
  // // checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong credentials!');
  }
  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );
  const result = await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
    {
      new: true,
    },
  );
  return result;
};
const refreshToken = async (token: string) => {
  // Check if the token is sent from the client
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }
  // check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;
  // check if the user exists
  const user = await User.isUserExistsByCustomId(userId);
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
  // checking if the user is blocked

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
  }
  if (
    user.passwordChangeAt &&
    User.isJwtIssuedBeforePasswordChanged(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  // token generate and send to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};
export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
};
