import mongoose from "mongoose";

const stopSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  sequence: { type: Number, required: true }
}, { _id: false });

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  routeNumber: { type: String, required: true, unique: true, trim: true },
  stops: { type: [stopSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("Route", routeSchema);
