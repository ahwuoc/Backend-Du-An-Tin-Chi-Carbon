import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  name: string;
  role?: "user" | "admin" | "editor";
  avatar?: string;
  phone?: string;
  address?: string;
  provider?: "local" | "google";
  ref?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Mongoose schema + gắn interface vào
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Địa chỉ email là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Tên người dùng là bắt buộc"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "editor"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "https://example.com/default-avatar.png",
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    ref: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  userSchema,
);
