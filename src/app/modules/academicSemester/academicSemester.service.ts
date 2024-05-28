import mongoose, { ObjectId } from "mongoose";
import { academicSemesterNameCodeMapper } from "./academicSemester.constants";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = (payload : TAcademicSemester) =>{
    // semester name and code checking
    if(academicSemesterNameCodeMapper[payload.name] !== payload.code){
        throw new Error("Semester code not matched!")
    }
    const result = AcademicSemester.create(payload)
    return result;
}
const getAllAcademicSemestersFromDB = async() =>{
    const result = await AcademicSemester.find()
    return result;
}
const getSingleAcademicSemesterFromDB = async (id : string) =>{
    const result = await AcademicSemester.findById(id);
    return result;
}
const updateAcademicSemesterIntoDB = async (id : string, payload: TAcademicSemester) =>{
    if(payload.name && payload.code && academicSemesterNameCodeMapper[payload.name] !== payload.code ){
        throw new Error("Invalid Semester Code");
    }
    const result = await AcademicSemester.findByIdAndUpdate({_id: id}, payload, {new:true} )
    return result;
}
export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcademicSemestersFromDB,
    getSingleAcademicSemesterFromDB,
    updateAcademicSemesterIntoDB
}