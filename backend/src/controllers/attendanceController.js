import Attendance from "../models/Attendance.js";
import { createResourceController } from "./resourceController.js";

const controller = createResourceController(Attendance, "attendance", ["student", "trip"]);

export const listAttendances = controller.list;
export const getAttendanceById = controller.getById;
export const createAttendance = controller.create;
export const updateAttendance = controller.update;
export const deleteAttendance = controller.remove;
