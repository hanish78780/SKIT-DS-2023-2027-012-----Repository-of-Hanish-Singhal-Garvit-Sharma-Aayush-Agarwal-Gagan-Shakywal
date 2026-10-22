import express from "express";
import { listAttendances, getAttendanceById, createAttendance, updateAttendance, deleteAttendance } from "../controllers/attendanceController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateToken);
router.get("/", listAttendances);
router.get("/:id", getAttendanceById);
router.post("/", requireRole("admin", "driver"), createAttendance);
router.put("/:id", requireRole("admin", "driver"), updateAttendance);
router.delete("/:id", requireRole("admin"), deleteAttendance);
export default router;
