import mongoose, { Schema } from "mongoose";
import type { IConsultation } from "../types/consultation";

const consultationSchema: Schema<IConsultation> = new Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: { type: String, required: false },
    location: { type: String, required: false },
    area: { type: String, required: false },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: false },
    consultationType: {
      type: String,
      enum: ["forest", "agriculture", "biochar", "csu", "carbonbook", "other"],
      required: true,
    },
    organization: { type: String, required: false },
    position: { type: String, required: false },
    experience: { type: String, required: false },
    education: { type: String, required: false },
    projectType: { type: String, required: false },
    projectSize: { type: String, required: false },
    projectLocation: { type: String, required: false },
    implementationTimeline: { type: String, required: false },
    budget: { type: String, required: false },
    carbonGoals: { type: String, required: false },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);
export default mongoose.model<IConsultation>(
  "Consultation",
  consultationSchema
);
