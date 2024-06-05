import { z } from 'zod';
import { BloodGroup, Gender } from './faculty.constants';
const UserNameSchema = z.object({
  firstName: z.string().trim(),
  middleName: z.string().optional(),
  lastName: z.string().trim(),
});

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    faculty: z.object({
      name: UserNameSchema,
      designation: z.string(),
      gender: z.enum([...Gender] as [string, ...string[]], {
        message: "Gender must be 'male', 'female', or 'other'",
      }),
      dateOfBirth: z.string(),
      email: z
        .string()
        .email({ message: 'Email must be a valid email address' }),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]], {
        message: 'Invalid blood group',
      }),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImg: z.string(),
      academicDepartment: z.string(),
      isDeleted: z.boolean().default(false),
    }),
  }),
});
const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

export const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      designation: z.string().optional(),
      name: updateUserNameValidationSchema,
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      profileImg: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});
export const facultyValidationSchema = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
