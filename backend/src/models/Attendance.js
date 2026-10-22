import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  status: { type: String, enum: ["present", "absent"], default: "present" },
  markedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
