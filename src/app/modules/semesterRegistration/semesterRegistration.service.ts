import { registrationStatus } from './semesterRegistration.constants';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import mongoose from 'mongoose';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  // Check if the semester is exists
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academic semester not found!',
    );
  }
  // if check there any registered semester that is already 'UPCOMING | ONGOING
  const isThereAnyUpcomingOROngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: registrationStatus.UPCOMING },
        { status: registrationStatus.ONGOING },
      ],
    });
  if (isThereAnyUpcomingOROngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already ${isThereAnyUpcomingOROngoingSemester.status} semester`,
    );
  }
  // Check if already semester registered.
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This semester is already registered!',
    );
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if the requested register semester is already exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.CONFLICT, 'This semester is not found!');
  }
  // check if the requested registration is ended, wel will not update anything
  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  const requestedStatus = payload?.status;

  if (currentSemesterStatus == registrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`,
    );
  }
  if (
    currentSemesterStatus === registrationStatus.UPCOMING &&
    requestedStatus === registrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly update status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }
  if (
    currentSemesterStatus === registrationStatus.ONGOING &&
    requestedStatus === registrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly update status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration is not found!',
    );
  }
  const semesterRegistrationStatus = isSemesterRegistrationExist.status;
  if (semesterRegistrationStatus !== registrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not delete as the registered semester is ${semesterRegistrationStatus}`,
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const isOfferedCoursesExistsForRegisteredSemester =
      await OfferedCourse.find({ semesterRegistration: id });
    if (isOfferedCoursesExistsForRegisteredSemester) {
      const deletedOfferedCourse = await OfferedCourse.deleteMany(
        { semesterRegistration: id },
        { session },
      );
      if (!deletedOfferedCourse) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to delete offered courses!',
        );
      }
    }

    const deletedSemesterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, { new: true, session });

    if (!deletedSemesterRegistration) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete semester registration',
      );
    }
    await session.commitTransaction()
    await session.endSession();
    
    return null;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return error;
  }
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
