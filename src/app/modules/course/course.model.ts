import { Schema, model } from 'mongoose';
import { TCourse, TPreRequisiteCourses } from './course.interface';
const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Title is required!'],
  },
  prefix: {
    type: String,
    trim: true,
    required: [true, 'Prefix is required!'],
  },
  code: {
    type: Number,
    trim: true,
    required: [true, 'Code is required!'],
  },
  credits: {
    type: Number,
    trim: true,
    required: [true, 'Credits is required!'],
  },
  preRequisiteCourses: [preRequisiteCoursesSchema],
  isDeleted: {
    type: Boolean, 
    default: false
  }
});

export const Course =  model<TCourse>('Course', courseSchema)
