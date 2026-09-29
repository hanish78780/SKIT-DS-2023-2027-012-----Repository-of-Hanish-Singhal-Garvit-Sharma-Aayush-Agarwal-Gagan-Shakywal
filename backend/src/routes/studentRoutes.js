import express from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from "../controllers/studentController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getStudents);
router.get("/:id", authenticateToken, getStudentById);
router.post("/", authenticateToken, createStudent);
router.put("/:id", authenticateToken, updateStudent);
router.delete("/:id", authenticateToken, deleteStudent);

export default router;
