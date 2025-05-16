import mongoose, { Schema, Document, Model } from "mongoose"; // Import Model

export interface INews extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId; // liên kết user
  category: string;
  status: "draft" | "published" | "archived";
  image?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề là bắt buộc"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Nội dung là bắt buộc"],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID là bắt buộc"],
      ref: "User",
    },
    category: {
      type: String,
      required: [true, "Danh mục là bắt buộc"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    image: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const News = (mongoose.models.News ||
  mongoose.model<INews>("News", NewsSchema)) as Model<INews>;

export default News;
