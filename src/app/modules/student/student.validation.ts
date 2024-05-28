import { z } from 'zod';
const capitalizeFormat = (value: string) => {
  const valCapitalize =
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  if (valCapitalize !== value) {
    throw new Error('First name must be in capitalize format');
  }
  return value;
};

const userNameSchema = z.object({
  firstName: z
    .string()
    .min(1, 'FirstName is required')
    .max(20, { message: 'First name cannot exceed 20 characters' })
    .refine(capitalizeFormat, {
      message: 'First name must be in capitalize format',
    }),
  middleName: z.string().optional(),
  lastName: z.string(),
});

const localGuardianSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

const guardianSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: userNameSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email({ message: 'Email must be a valid email address' }),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianSchema,
      localGuardian: localGuardianSchema,
      admissionSemester: z.string(),
      profileImg: z
        .string()
        .url({ message: 'Profile image must be a valid URL' })
        .optional(),
      
    }),
  }),
});
const updateStudentValidationSchema = createStudentValidationSchema.partial();

export { createStudentValidationSchema, updateStudentValidationSchema };
