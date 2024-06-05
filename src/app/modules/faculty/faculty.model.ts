import mongoose, { Schema } from 'mongoose';
import { TFaculty, TUsername } from './faculty.interface';
import validator from 'validator';

// Define Mongoose schema corresponding to the TypeScript types
const UserNameSchema = new Schema<TUsername>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
});

const FacultySchema = new Schema<TFaculty>({
  id: {
    type: String,
    required: [true, 'ID is required'],
    unique: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  name: {
    type: UserNameSchema,
    required: [true, 'Name is required'],
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
    enum: {
      values: ['male', 'female', 'other'],
      message:
        "{VALUE} is not valid. Please select: 'male', 'female' or 'other'",
    },
    required: [true, 'Gender is required'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email type',
    },
    unique: true,
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact number is required'],
    trim: true,
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not valid. Please choose a valid blood group',
    },
    required: [true, 'Blood group is required'],
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required'],
    trim: true,
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
    trim: true,
  },
  profileImg: {
    type: String,
    trim: true,
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
    required: [true, 'Academic department is required'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: [true, 'Deletion status is required'],
  },
});

// Create the Mongoose model
const Faculty = mongoose.model<TFaculty>('Faculty', FacultySchema);

export default Faculty;
