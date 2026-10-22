import express from "express";

import {
  listTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  updateTripLocation,
  getTripLocation
} from "../controllers/tripController.js";

import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

// Specific GPS routes must precede the generic /:id route.
router.post("/:tripId/location", updateTripLocation);
router.get("/:tripId/location", getTripLocation);

// Trip CRUD
router.get("/", listTrips);
router.get("/:id", getTripById);
router.post("/", requireRole("admin", "driver"), createTrip);
router.put("/:id", requireRole("admin", "driver"), updateTrip);
router.delete("/:id", requireRole("admin"), deleteTrip);

export default router;
