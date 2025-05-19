import { Schema, model, Types } from "mongoose";
export interface IActivity {
  title: string;
  date: string; // ISO string
  description: string;
}

export interface ICoordinates {
  lat: number;
  lng: number;
}
export interface IProjectDocument {
  name: string;
  url: string;
  type?: string;
  uploadedAt?: string;
  userId?: string;
}

export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  status?: "pending" | "active" | "completed" | "archived";
  registrationDate?: string;
  startDate?: string;
  endDate?: string;
  carbonCredits?: number;
  carbonCreditsTotal?: number;
  carbonCreditsClaimed?: number;
  type?: string;
  location?: string;
  coordinates?: ICoordinates;
  area?: number;
  participants?: string[];
  progress?: number;
  documents?: IProjectDocument;
  activities?: IActivity[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}
const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "archived"],
      default: "pending",
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String },
        uploadedAt: { type: Date, default: Date.now },
        userId: { type: Types.ObjectId, ref: "User" },
      },
    ],
    registrationDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    carbonCredits: { type: Number, default: 0 },
    carbonCreditsTotal: { type: Number, default: 0 },
    carbonCreditsClaimed: { type: Number, default: 0 },
    type: { type: String }, // có thể thêm enum nếu biết cụ thể
    location: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    area: { type: Number }, // đơn vị m² hoặc ha
    participants: [{ type: String }], // hoặc ref tới User nếu cần
    progress: { type: Number, min: 0, max: 100 },
    activities: [
      {
        title: String,
        date: Date,
        description: String,
      },
    ],
    userId: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

export const Project = model("Project", ProjectSchema);
