const mongoose = require("mongoose");
import { Types } from "mongoose"; // For ObjectId
export interface IProjectDocument {
  name: string;
  url: string;
  type?: string;
}
interface ProjectCarbonData {
  name: string;
  organization?: string;
  phone: string;
  email: string;
  address?: string; // Optional
  projectType: "forest" | "rice" | "biochar";
  details: {
    forestLocation?: string;
    forestArea?: string;
    treeSpecies?: string;
    plantingAge?: string;
    averageHeight?: string;
    averageCircumference?: string;
    previousDeforestation?: "no" | "yes" | "unknown" | "";

    riceLocation?: string;
    riceArea?: string;
    riceTerrain?: string;
    riceClimate?: string;
    riceSoilType?: string;
    riceStartDate?: Date | null;
    riceEndDate?: Date | null;

    biocharRawMaterial?: string;
    biocharCarbonContent?: string;
    biocharLandArea?: string;
    biocharApplicationMethod?: string;
  };
  status: "active" | "pending" | "completed";
  additionalInfo?: string; // Optional
  landDocuments?: IProjectDocument[];
  kmlFile?: string | null; // String or null
  userId: Types.ObjectId;
}
const ProjectCarbonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      require: true,
      enum: ["active", "pending", "completed"],
      default: "active",
    },
    organization: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email không hợp lệ"],
    },
    address: {
      type: String,
      trim: true,
    },

    projectType: {
      type: String,
      required: true,
      enum: ["forest", "rice", "biochar"],
    },

    details: {
      forestLocation: { type: String, trim: true },
      forestArea: { type: String, trim: true },
      treeSpecies: { type: String, trim: true },
      plantingAge: { type: String, trim: true },
      averageHeight: { type: String, trim: true },
      averageCircumference: { type: String, trim: true },
      previousDeforestation: {
        type: String,
        trim: true,
        enum: ["no", "yes", "unknown", ""],
      },

      riceLocation: { type: String, trim: true },
      riceArea: { type: String, trim: true },
      riceTerrain: { type: String, trim: true },
      riceClimate: { type: String, trim: true },
      riceSoilType: { type: String, trim: true },
      riceStartDate: { type: Date },
      riceEndDate: { type: Date },

      biocharRawMaterial: { type: String, trim: true },
      biocharCarbonContent: { type: String, trim: true },
      biocharLandArea: { type: String, trim: true },
      biocharApplicationMethod: { type: String, trim: true },
    },

    additionalInfo: {
      type: String,
      trim: true,
    },

    landDocuments: {
      type: [
        {
          name: { type: String, required: true },
          url: { type: String, required: true },
          type: { type: String }, // optional
        },
      ],
      default: [],
    },
    kmlFile: {
      type: String,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectCarbon = mongoose.model(
  "ProjectCarbon",
  ProjectCarbonSchema,
);
