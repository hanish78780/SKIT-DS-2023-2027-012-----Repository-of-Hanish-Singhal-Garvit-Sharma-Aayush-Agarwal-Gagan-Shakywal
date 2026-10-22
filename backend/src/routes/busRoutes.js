import express from "express";
import { listBuses, getBusById, createBus, updateBus, deleteBus } from "../controllers/busController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateToken);
router.get("/", listBuses);
router.get("/:id", getBusById);
router.post("/", requireRole("admin"), createBus);
router.put("/:id", requireRole("admin"), updateBus);
router.delete("/:id", requireRole("admin"), deleteBus);
export default router;
