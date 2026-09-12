import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  driverId: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, trim: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" }
}, { timestamps: true });

export default mongoose.model("Driver", driverSchema);
