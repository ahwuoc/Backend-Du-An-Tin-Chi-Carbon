import { Schema, model, Types } from "mongoose";

export interface IProjectMember {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  role?: "owner" | "member" | "viewer";
  joinedAt?: Date;
  status?: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
}
const ProjectMemberSchema = new Schema<IProjectMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    role: {
      type: String,
      enum: ["owner", "member", "viewer"],
      default: "member",
    },
    joinedAt: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

export const ProjectMember = model("ProjectMember", ProjectMemberSchema);
