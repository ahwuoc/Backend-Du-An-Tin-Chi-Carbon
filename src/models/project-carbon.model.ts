const mongoose = require("mongoose");
import { Types } from "mongoose"; // For ObjectId

export interface IProjectDocument {
  name: string;
  url: string;
  type?: string;
}

// Thêm interface cho KML File nếu bạn muốn nó có cấu trúc cụ thể
export interface IKmlFile {
  name: string;
  url: string;
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
  kmlFile?: IKmlFile | null; // Đã cập nhật thành đối tượng hoặc null
  userId: Types.ObjectId;
}

// Định nghĩa sub-schema cho LandDocument (tùy chọn, nhưng tốt cho rõ ràng)
const LandDocumentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String }, // optional
  },
  { _id: false },
); // Không cần _id cho sub-document nếu không có yêu cầu đặc biệt

// Định nghĩa sub-schema cho KML File (đã cập nhật)
const KmlFileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const ProjectCarbonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true, // `require` nên là `required`
      enum: ["active", "pending", "completed", "archived"], // Thêm "archived" nếu bạn sử dụng nó
      default: "pending", // Đã sửa đổi default thành "pending"
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
      type: new mongoose.Schema(
        {
          // Đã bọc trong new mongoose.Schema
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
        { _id: false, minimize: false },
      ), // Thêm minimize: false
      default: {}, // Đảm bảo default là một đối tượng rỗng
    },

    additionalInfo: {
      type: String,
      trim: true,
    },

    landDocuments: {
      type: [LandDocumentSchema], // Sử dụng LandDocumentSchema
      default: [],
    },
    kmlFile: {
      type: KmlFileSchema, // Đã cập nhật để sử dụng KmlFileSchema
      default: null,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Tùy chọn: nếu userId có thể là null khi frontend gửi
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
