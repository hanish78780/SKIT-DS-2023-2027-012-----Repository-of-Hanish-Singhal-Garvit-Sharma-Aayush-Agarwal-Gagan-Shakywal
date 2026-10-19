import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true, trim: true },
  registrationNumber: { type: String, unique: true, sparse: true, trim: true },
  capacity: { type: Number, min: 1 },
  status: { type: String, enum: ["active", "inactive", "maintenance"], default: "active" }
}, { timestamps: true });

export default mongoose.model("Bus", busSchema);
