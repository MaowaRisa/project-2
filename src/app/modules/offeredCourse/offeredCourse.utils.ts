import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
    // assignedSchedules.forEach((schedule) => {});
    // forEach will run for all if it finds one true it will not break thats why we use For -- loop or For Of
    for(const schedule of assignedSchedules){
        const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
        const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
        const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);
    
        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
          return true;
        }
    }
    return false;
};
