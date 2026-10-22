import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import mongoose from "mongoose";
import app from "../src/app.js";

let server;
let baseUrl;

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

test("application imports and serves process health without a database connection", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.service, "unitransit-backend");
  assert.equal(body.status, "healthy");
  assert.ok(Number.isFinite(Date.parse(body.timestamp)));
});

test("student route population can resolve its registered Route model", () => {
  const Student = mongoose.model("Student");
  const routeModelName = Student.schema.path("route").options.ref;

  assert.equal(mongoose.model(routeModelName).modelName, "Route");
});

test("all student operations reject missing tokens before reaching the database", async () => {
  const operations = [
    ["GET", "/api/students"],
    ["POST", "/api/students"],
    ["GET", "/api/students/507f1f77bcf86cd799439011"],
    ["PUT", "/api/students/507f1f77bcf86cd799439011"],
    ["DELETE", "/api/students/507f1f77bcf86cd799439011"]
  ];

  for (const [method, path] of operations) {
    const response = await fetch(`${baseUrl}${path}`, { method });
    const body = await response.json();

    assert.equal(response.status, 401, `${method} ${path}`);
    assert.equal(body.message, "Authentication token is required");
  }
});

test("profile requests reject an invalid token before reaching the database", async () => {
  const response = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Authorization: "Bearer invalid-token" }
  });

  assert.equal(response.status, 401);
  assert.equal((await response.json()).message, "Invalid or expired authentication token");
});
