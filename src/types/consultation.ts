import { Types } from "mongoose";

export interface IConsultation {
  userId: Types.ObjectId;
  name: string;
  age?: string;
  location?: string;
  area?: string;
  phone: string;
  email: string;
  message?: string;
  consultationType:
    | "forest"
    | "agriculture"
    | "biochar"
    | "csu"
    | "carbonbook"
    | "other";
  organization?: string;
  position?: string;
  experience?: string;
  education?: string;
  projectType?: string;
  projectSize?: string;
  projectLocation?: string;
  implementationTimeline?: string;
  budget?: string;
  carbonGoals?: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
