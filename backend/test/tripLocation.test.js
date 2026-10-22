import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../src/app.js";
import Trip from "../src/models/Trip.js";
import Driver from "../src/models/Driver.js";
import User from "../src/models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_key_unitransit_123456789";
process.env.JWT_SECRET = JWT_SECRET;

let server;
let baseUrl;

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("POST /api/trips/:tripId/location rejects request when token is missing", async () => {
  const tripId = new mongoose.Types.ObjectId().toString();
  const res = await fetch(`${baseUrl}/api/trips/${tripId}/location`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      latitude: 26.8678,
      longitude: 75.7965,
      timestamp: new Date().toISOString()
    })
  });

  const body = await res.json();
  assert.equal(res.status, 401);
  assert.equal(body.success, false);
  assert.equal(body.message, "Authentication token is required");
});

test("POST /api/trips/:tripId/location rejects request with invalid token", async () => {
  const tripId = new mongoose.Types.ObjectId().toString();
  const res = await fetch(`${baseUrl}/api/trips/${tripId}/location`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer invalid_or_corrupt_jwt_token"
    },
    body: JSON.stringify({
      latitude: 26.8678,
      longitude: 75.7965,
      timestamp: new Date().toISOString()
    })
  });

  const body = await res.json();
  assert.equal(res.status, 401);
  assert.equal(body.success, false);
  assert.equal(body.message, "Invalid or expired authentication token");
});

test("POST /api/trips/:tripId/location rejects malformed trip ID format", async () => {
  const token = generateToken({ userId: new mongoose.Types.ObjectId().toString(), role: "driver" });
  const res = await fetch(`${baseUrl}/api/trips/not-a-valid-object-id/location`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      latitude: 26.8678,
      longitude: 75.7965,
      timestamp: new Date().toISOString()
    })
  });

  const body = await res.json();
  assert.equal(res.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.message, "Invalid trip ID format");
});

test("POST /api/trips/:tripId/location rejects invalid coordinates", async () => {
  const tripId = new mongoose.Types.ObjectId().toString();
  const token = generateToken({ userId: new mongoose.Types.ObjectId().toString(), role: "driver" });

  const invalidCases = [
    { body: { latitude: 95.0, longitude: 75.0, timestamp: Date.now() }, err: "Latitude must be a valid number between -90 and 90" },
    { body: { latitude: -95.0, longitude: 75.0, timestamp: Date.now() }, err: "Latitude must be a valid number between -90 and 90" },
    { body: { latitude: "26.86", longitude: 75.0, timestamp: Date.now() }, err: "Latitude must be a valid number between -90 and 90" },
    { body: { latitude: 26.0, longitude: 185.0, timestamp: Date.now() }, err: "Longitude must be a valid number between -180 and 180" },
    { body: { latitude: 26.0, longitude: -185.0, timestamp: Date.now() }, err: "Longitude must be a valid number between -180 and 180" },
    { body: { latitude: 26.0, longitude: 75.0, accuracy: -5, timestamp: Date.now() }, err: "Accuracy must be a non-negative number" },
    { body: { latitude: 26.0, longitude: 75.0 }, err: "Timestamp is required" },
    { body: { latitude: 26.0, longitude: 75.0, timestamp: "invalid-date" }, err: "Invalid timestamp format" },
    { body: { latitude: 26.0, longitude: 75.0, timestamp: Date.now() + 1000000 }, err: "Timestamp cannot be in the future" }
  ];

  for (const { body, err } of invalidCases) {
    const res = await fetch(`${baseUrl}/api/trips/${tripId}/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const resBody = await res.json();
    assert.equal(res.status, 400, `Expected 400 for ${JSON.stringify(body)}`);
    assert.equal(resBody.message, err);
  }
});

test("POST /api/trips/:tripId/location rejects non-driver and non-admin roles", async () => {
  const tripId = new mongoose.Types.ObjectId().toString();
  const token = generateToken({ userId: new mongoose.Types.ObjectId().toString(), role: "student" });

  const res = await fetch(`${baseUrl}/api/trips/${tripId}/location`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      latitude: 26.8678,
      longitude: 75.7965,
      accuracy: 5.0,
      timestamp: new Date().toISOString()
    })
  });

  const body = await res.json();
  assert.equal(res.status, 403);
  assert.equal(body.success, false);
  assert.equal(body.message, "Driver or admin role required to update trip location");
});

test("Trip controller logic: enforces active trip status, driver authorization, and stale update prevention", async () => {
  const { updateTripLocation, getTripLocation } = await import("../src/controllers/tripController.js");

  const driverId = new mongoose.Types.ObjectId();
  const otherDriverId = new mongoose.Types.ObjectId();
  const tripId = new mongoose.Types.ObjectId();

  const mockTrip = {
    _id: tripId,
    status: "scheduled",
    driver: driverId,
    currentLocation: null,
    save: async function () { return this; }
  };

  // 1. Inactive trip test (scheduled status)
  Trip.findById = async (id) => (id.toString() === tripId.toString() ? mockTrip : null);

  let statusCode;
  let jsonResult;
  const mockRes = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResult = data;
      return this;
    }
  };

  const driverReq = {
    params: { tripId: tripId.toString() },
    user: { userId: driverId.toString(), role: "driver" },
    body: {
      latitude: 26.8678,
      longitude: 75.7965,
      accuracy: 5,
      timestamp: Date.now()
    }
  };

  await updateTripLocation(driverReq, mockRes);
  assert.equal(statusCode, 400);
  assert.match(jsonResult.message, /Trip must be active/);

  // 2. Unauthorized driver test (trip is active, but different driver)
  mockTrip.status = "active";
  User.findById = async () => null;
  Driver.findOne = async () => null;
  Driver.findById = async () => null;

  const unauthorizedReq = {
    params: { tripId: tripId.toString() },
    user: { userId: otherDriverId.toString(), role: "driver" },
    body: {
      latitude: 26.8678,
      longitude: 75.7965,
      accuracy: 5,
      timestamp: Date.now()
    }
  };

  await updateTripLocation(unauthorizedReq, mockRes);
  assert.equal(statusCode, 403);
  assert.match(jsonResult.message, /not authorized/);

  // 3. Authorized driver updates location successfully
  const fixTime1 = Date.now() - 5000;
  const authorizedReq = {
    params: { tripId: tripId.toString() },
    user: { userId: driverId.toString(), role: "driver" },
    body: {
      latitude: 26.8678,
      longitude: 75.7965,
      accuracy: 4.5,
      timestamp: fixTime1
    }
  };

  await updateTripLocation(authorizedReq, mockRes);
  assert.equal(statusCode, 200);
  assert.equal(jsonResult.success, true);
  assert.equal(jsonResult.data.currentLocation.latitude, 26.8678);
  assert.equal(jsonResult.data.currentLocation.longitude, 75.7965);
  assert.equal(jsonResult.data.currentLocation.accuracy, 4.5);

  // 4. Stale/out-of-order update rejection (timestamp older than or equal to current fix)
  const staleReq = {
    params: { tripId: tripId.toString() },
    user: { userId: driverId.toString(), role: "driver" },
    body: {
      latitude: 26.8670,
      longitude: 75.7960,
      accuracy: 10,
      timestamp: fixTime1 - 1000
    }
  };

  await updateTripLocation(staleReq, mockRes);
  assert.equal(statusCode, 409);
  assert.match(jsonResult.message, /Stale location update/);

  // 5. Subsequent newer update succeeds
  const newerReq = {
    params: { tripId: tripId.toString() },
    user: { userId: driverId.toString(), role: "driver" },
    body: {
      latitude: 26.8700,
      longitude: 75.8000,
      accuracy: 3.2,
      timestamp: fixTime1 + 2000
    }
  };

  await updateTripLocation(newerReq, mockRes);
  assert.equal(statusCode, 200);
  assert.equal(jsonResult.data.currentLocation.latitude, 26.8700);
  assert.equal(jsonResult.data.currentLocation.longitude, 75.8000);

  // 6. GET /api/trips/:tripId/location retrieves updated coordinates
  Trip.findById = () => ({
    select: () => mockTrip
  });

  const getReq = {
    params: { tripId: tripId.toString() }
  };

  await getTripLocation(getReq, mockRes);
  assert.equal(statusCode, 200);
  assert.equal(jsonResult.data.currentLocation.latitude, 26.8700);
  assert.equal(jsonResult.data.currentLocation.longitude, 75.8000);
});
