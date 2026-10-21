import mongoose from "mongoose";
import Trip from "../models/Trip.js";
import Driver from "../models/Driver.js";
import User from "../models/User.js";

/**
 * Validates coordinate inputs according to WGS-84 coordinate bounds.
 */
function validateCoordinates(latitude, longitude, accuracy, timestamp) {
  if (typeof latitude !== "number" || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return "Latitude must be a valid number between -90 and 90";
  }

  if (typeof longitude !== "number" || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return "Longitude must be a valid number between -180 and 180";
  }

  if (accuracy !== undefined && accuracy !== null) {
    if (typeof accuracy !== "number" || !Number.isFinite(accuracy) || accuracy < 0) {
      return "Accuracy must be a non-negative number";
    }
  }

  if (timestamp === undefined || timestamp === null) {
    return "Timestamp is required";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "Invalid timestamp format";
  }

  const now = Date.now();
  // Clock skew tolerance of 60 seconds
  if (date.getTime() > now + 60000) {
    return "Timestamp cannot be in the future";
  }

  // Reject historical updates older than 7 days
  if (date.getTime() < now - 7 * 24 * 60 * 60 * 1000) {
    return "Timestamp is too old";
  }

  return null;
}

/**
 * POST /api/trips/:tripId/location
 * Updates live GPS position for an active trip.
 */
export async function updateTripLocation(req, res) {
  try {
    const { tripId } = req.params;

    if (!mongoose.isValidObjectId(tripId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID format"
      });
    }

    const { latitude, longitude, accuracy, timestamp } = req.body;

    const validationError = validateCoordinates(latitude, longitude, accuracy, timestamp);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const fixTime = new Date(timestamp);

    // Verify authorized role
    if (!req.user || !["driver", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Driver or admin role required to update trip location"
      });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    // Verify trip is active
    if (trip.status !== "active") {
      return res.status(400).json({
        success: false,
        message: `Cannot update location for a trip with status: ${trip.status}. Trip must be active.`
      });
    }

    // Verify driver authorization
    if (req.user.role === "driver") {
      const user = await User.findById(req.user.userId);
      let driver = null;
      if (user?.email) {
        driver = await Driver.findOne({ email: user.email.toLowerCase() });
      }
      if (!driver) {
        driver = await Driver.findById(req.user.userId);
      }

      const tripDriverId = trip.driver?.toString();
      const isAuthorized =
        (driver && tripDriverId === driver._id.toString()) ||
        tripDriverId === req.user.userId;

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update location for this trip"
        });
      }
    }

    // Guard against stale or out-of-order updates
    if (trip.currentLocation?.recordedAt) {
      const lastRecorded = new Date(trip.currentLocation.recordedAt);
      if (fixTime.getTime() <= lastRecorded.getTime()) {
        return res.status(409).json({
          success: false,
          message: "Stale location update: fix timestamp is older than or equal to current trip location"
        });
      }
    }

    // Persist latest valid location
    trip.currentLocation = {
      latitude,
      longitude,
      accuracy: accuracy !== undefined && accuracy !== null ? accuracy : undefined,
      recordedAt: fixTime
    };

    await trip.save();

    return res.status(200).json({
      success: true,
      message: "Trip location updated successfully",
      data: {
        tripId: trip._id,
        status: trip.status,
        currentLocation: trip.currentLocation
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update trip location",
      error: error.message
    });
  }
}

/**
 * GET /api/trips/:tripId/location
 * Retrieves latest location of a trip.
 */
export async function getTripLocation(req, res) {
  try {
    const { tripId } = req.params;

    if (!mongoose.isValidObjectId(tripId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID format"
      });
    }

    const trip = await Trip.findById(tripId).select("status currentLocation bus route driver");
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        tripId: trip._id,
        status: trip.status,
        currentLocation: trip.currentLocation || null
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch trip location",
      error: error.message
    });
  }
}
