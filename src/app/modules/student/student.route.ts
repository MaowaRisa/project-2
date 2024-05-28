import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

// will call the controller function
// router.post('/create-student', StudentControllers.createStudent);

// update the student
router.put('/update-student/:studentId', StudentControllers.updateStudent);
router.get('/', StudentControllers.getAllStudents);

router.get('/:studentId', StudentControllers.getSingleStudent);

router.delete('/:studentId', StudentControllers.deleteStudent);

export const StudentRoutes = router;
