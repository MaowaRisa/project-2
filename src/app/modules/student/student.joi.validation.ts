import Joi from 'joi';
const capitalizeFormat = (value: string, helpers: any) => {
  const valCapitalize =
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  if (valCapitalize !== value) {
    return helpers.error('string.custom');
  }
  return value;
};

const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .trim()
    .max(20)
    .custom(capitalizeFormat, 'capitalize format validation')
    .messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name is required',
      'string.max': 'First name cannot exceed 20 characters',
      'string.custom': 'First name must be in capitalize format',
    }),
  middleName: Joi.string().trim().allow(null, ''),
  lastName: Joi.string().required().trim().messages({
    'string.base': 'Last name must be a string',
    'string.empty': 'Last name is required',
  }),
});

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.base': "Local guardian's name must be a string",
    'string.empty': "Local guardian's name is required",
  }),
  occupation: Joi.string().required().trim().messages({
    'string.base': "Local guardian's occupation must be a string",
    'string.empty': "Local guardian's occupation is required",
  }),
  contactNo: Joi.string().required().trim().messages({
    'string.base': "Local guardian's contact number must be a string",
    'string.empty': "Local guardian's contact number is required",
  }),
  address: Joi.string().required().trim().messages({
    'string.base': "Local guardian's address must be a string",
    'string.empty': "Local guardian's address is required",
  }),
});

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().trim().messages({
    'string.base': "Father's name must be a string",
    'string.empty': "Father's name is required",
  }),
  fatherOccupation: Joi.string().required().trim().messages({
    'string.base': "Father's occupation must be a string",
    'string.empty': "Father's occupation is required",
  }),
  fatherContactNo: Joi.string().required().trim().messages({
    'string.base': "Father's contact number must be a string",
    'string.empty': "Father's contact number is required",
  }),
  motherName: Joi.string().required().trim().messages({
    'string.base': "Mother's name must be a string",
    'string.empty': "Mother's name is required",
  }),
  motherOccupation: Joi.string().required().trim().messages({
    'string.base': "Mother's occupation must be a string",
    'string.empty': "Mother's occupation is required",
  }),
  motherContactNo: Joi.string().required().trim().messages({
    'string.base': "Mother's contact number must be a string",
    'string.empty': "Mother's contact number is required",
  }),
});

const studentValidationSchema = Joi.object({
  id: Joi.string().required().trim().messages({
    'string.base': 'Student ID must be a string',
    'string.empty': 'Student ID is required',
  }),
  name: userNameValidationSchema.required().messages({
    'object.base': "Student's full name is required",
  }),
  gender: Joi.string()
    .required()
    .valid('male', 'female', 'other')
    .trim()
    .messages({
      'string.base': 'Gender must be a string',
      'string.empty': 'Gender is required',
      'any.only':
        "{#value} is not valid. Please select: 'male', 'female' or 'other'",
    }),
  dateOfBirth: Joi.string().required().trim().messages({
    'string.base': 'Date of birth must be a string',
    'string.empty': 'Date of birth is required',
  }),
  email: Joi.string().required().trim().email().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  contactNo: Joi.string().required().trim().messages({
    'string.base': 'Contact number must be a string',
    'string.empty': 'Contact number is required',
  }),
  emergencyContactNo: Joi.string().required().trim().messages({
    'string.base': 'Emergency contact number must be a string',
    'string.empty': 'Emergency contact number is required',
  }),
  bloodGroup: Joi.string()
    .required()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .trim()
    .messages({
      'string.base': 'Blood group must be a string',
      'string.empty': 'Blood group is required',
      'any.only': '{#value} is not valid. Please choose a valid blood group',
    }),
  presentAddress: Joi.string().required().trim().messages({
    'string.base': 'Present address must be a string',
    'string.empty': 'Present address is required',
  }),
  permanentAddress: Joi.string().required().trim().messages({
    'string.base': 'Permanent address must be a string',
    'string.empty': 'Permanent address is required',
  }),
  guardian: guardianValidationSchema.required().messages({
    'object.base': 'Guardian information is required',
  }),
  localGuardian: localGuardianValidationSchema.required().messages({
    'object.base': 'Local guardian information is required',
  }),
  profileImg: Joi.string().trim().uri().messages({
    'string.base': 'Profile image URL must be a string',
    'string.uri': 'Profile image must be a valid URL',
  }),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'string.base': 'Status must be a string',
    'any.only':
      '{#value} is not valid. Status must be either "active" or "blocked"',
  }),
});
export default studentValidationSchema;
