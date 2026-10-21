import express from "express";
import {
  updateTripLocation,
  getTripLocation
} from "../controllers/tripController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:tripId/location", authenticateToken, updateTripLocation);
router.get("/:tripId/location", authenticateToken, getTripLocation);

export default router;
