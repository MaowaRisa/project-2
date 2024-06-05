import QueryBuilder from '../../builder/QueryBuilder';
import { TFaculty } from './faculty.interface';
import Faculty from './faculty.model';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(Faculty.find(), query);
  const facultyData = await facultyQuery.modelQuery;
  return facultyData;
};
const getSingleFacultyFromDB = async (id: string) => {
  const result = Faculty.find({ id: id });
  return result;
};
const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  console.log(id);
  const result = await Faculty.findOneAndUpdate(
    { id: id },
    modifiedUpdatedData,
    { new: true },
  );

  return result;
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
};
