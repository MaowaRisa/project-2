import { Schema, model } from 'mongoose';
import {
  TAcademicSemester,
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TMonth,
} from './academicSemester.interface';
import { AcademicSemesterCode, AcademicSemesterName, Months } from './academicSemester.constants';


const academicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    enum: {
      values: AcademicSemesterName,
      message:
        "{VALUE} is not valid semester name! choose from 'Autumn', 'Summer' or 'Fall'.",
    },
    required: [true, 'Semester name is required!'],
  },
  code: {
    type: String,
    enum: {
      values: AcademicSemesterCode,
      message: "{VALUE} is not valid! Please choose from '01', '02' or '03'",
    },
  },
  year: {
    type: String,
    required: [true, "Date is required!"]
  },
  startMonth: {
    type: String,
    enum: {
      values: Months,
      message:
        "{VALUE} is not valid! Please choose from 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'",
    },
    required: [true, "Start month is required!"]
  },
  endMonth: {
    type: String,
    enum: {
      values: Months,
      message:
        "{VALUE} is not valid! Please choose from 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'",
    },
    required: [true, "End month is required!"],
  },
});

// Middleware
// one semester per year
academicSemesterSchema.pre('save', async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({ 
        year: this.year,
        name: this.name
    });
    if(isSemesterExists){
        throw new Error("Semester is already exists!")
    }
})

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
