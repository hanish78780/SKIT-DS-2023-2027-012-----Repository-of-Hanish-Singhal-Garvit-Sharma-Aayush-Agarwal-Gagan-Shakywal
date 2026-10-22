import express from "express";
import { listTrips, getTripById, createTrip, updateTrip, deleteTrip } from "../controllers/tripController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateToken);
router.get("/", listTrips);
router.get("/:id", getTripById);
router.post("/", requireRole("admin", "driver"), createTrip);
router.put("/:id", requireRole("admin", "driver"), updateTrip);
router.delete("/:id", requireRole("admin"), deleteTrip);
export default router;
