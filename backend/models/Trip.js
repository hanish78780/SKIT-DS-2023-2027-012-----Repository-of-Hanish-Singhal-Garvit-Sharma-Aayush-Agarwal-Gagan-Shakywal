import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  status: { type: String, enum: ["scheduled", "active", "completed", "cancelled"], default: "scheduled" },
  startedAt: Date,
  endedAt: Date,
  currentLocation: locationSchema
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
