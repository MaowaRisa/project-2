import { z } from 'zod';
import { Days } from './offeredCourse.constants';

const timeStringSchema = z.string().refine((time) => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
  return regex.test(time);
}, {
    message: 'Invalid time format, expected "HH:MM" in 24 hours format'
});
const createOfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    academicFaculty: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number(),
    section: z.number(),
    days: z.array(z.enum([...Days] as [string, ...string[]])),
    startTime: timeStringSchema,
    endTime: timeStringSchema,
  }).refine((body)=>{
    // startTime: 10:30 => 1970-01-01T10:30
    // endTime: 12:30 => 1970-01-01T12:30
    const start = new Date(`1970-01-01T${body.startTime}`)
    const end = new Date(`1970-01-01T${body.endTime}`)
    return end > start
  },{
    message: 'Start time should be before end time!'
  }),
});
const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    days: z.array(z.enum([...Days] as [string, ...string[]])).optional(),
    startTime: timeStringSchema,
    endTime: timeStringSchema,
  }),
});
export const offeredCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
