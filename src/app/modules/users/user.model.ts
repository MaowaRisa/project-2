import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0
    },
    needsPasswordChange: {
      type: Boolean,
      required: true,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
// pre save middleware // will work on create() and save()
userSchema.pre('save', async function (next) {
  // hashing password and save into DB
  // const user = this
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});
// set password as empty sting
userSchema.post('save', function (updatedDoc, next) {
  updatedDoc.password = '';
  next();
});
userSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isUserExist = await User.findOne(query);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  next();
});
userSchema.statics.isUserExistsByCustomId = async function(id){
  return await User.findOne({id})
}
userSchema.statics.isPasswordMatched = async function(plainTextPassword, hashedPassword){
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

export const User = model<TUser, UserModel>('User', userSchema);
