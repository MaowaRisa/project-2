import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});
// set password as empty sting
userSchema.post('save', function (updatedDoc, next) {
  updatedDoc.password = '';
  next();
});

export const User = model<TUser>('User', userSchema);
