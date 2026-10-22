import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  studentId: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, trim: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
