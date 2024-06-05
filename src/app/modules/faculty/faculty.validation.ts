import { z } from 'zod';
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
      gender: z.enum(['male', 'female', 'other'], {
          message: "Gender must be 'male', 'female', or 'other'",
        }),
      dateOfBirth: z.string(),
      email: z.string()
        .email({ message: 'Email must be a valid email address' }),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
          message: 'Invalid blood group',
        }),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImg: z.string(),
      academicDepartment: z.string(),
      isDeleted: z
        .boolean()
        .default(false)
    }),
  }),
});

export const facultyValidationSchema ={
    createFacultyValidationSchema
};
