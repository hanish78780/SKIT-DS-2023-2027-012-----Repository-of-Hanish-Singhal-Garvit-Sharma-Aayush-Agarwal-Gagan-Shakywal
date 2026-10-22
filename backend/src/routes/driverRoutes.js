import express from "express";
import { listDrivers, getDriverById, createDriver, updateDriver, deleteDriver } from "../controllers/driverController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateToken);
router.get("/", listDrivers);
router.get("/:id", getDriverById);
router.post("/", requireRole("admin"), createDriver);
router.put("/:id", requireRole("admin"), updateDriver);
router.delete("/:id", requireRole("admin"), deleteDriver);
export default router;
