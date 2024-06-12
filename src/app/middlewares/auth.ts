import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utility/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import config from '../config';
import { TUserRole } from '../modules/users/user.interface';
import { User } from '../modules/users/user.model';

// interface CustomRequest extends Request{
//     user : JwtPayload
// }
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // Check if the token is sent from the client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    // check if the token is valid
    // jwt.verify(token, config.jwt_access_secret as string,function(err, decoded){
    //     if(err){
    //         throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    //     }
    //     // checking the required role
    //     const role = (decoded as JwtPayload).role;

    //     if(requiredRoles && !requiredRoles.includes(role)){
    //         throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    //     }
    //     req.user = decoded as JwtPayload;
    // } )
    // another way using try catch but as we are using catchAsync
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;
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
    if(user.passwordChangeAt && User.isJwtIssuedBeforePasswordChanged(user.passwordChangeAt, iat as number)){
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
