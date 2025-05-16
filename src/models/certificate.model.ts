import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["international_certificates"], required: true },
  description: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "expired"], required: true },
  image: { type: String }, // ảnh thumbnail hoặc minh hoạ
  certificateImage: { type: String, default: "" }, // ảnh chính thức của chứng chỉ
  features: { type: [String], default: [] },
  customFeatureName: { type: String, default: "" },
  price: { type: Number, required: true },
  certificationLevel: {
    type: String,
    enum: ["Nghiên cứu", "Chuyên gia"],
    required: true,
  },
  courseProgress: { type: Number, min: 0, max: 100 },
  lastAccessed: { type: Date },
  issuer: { type: String },

  progressStatus: {
    type: String,
    progressStatus: {
      type: String,
      default: function (this: any) {
        if (this.courseProgress >= 100) return "Hoàn thành";
        if (this.courseProgress > 0) return "Đang học";
        return "Chưa học";
      },
    },
  },
});

export const Certificate = mongoose.model("Certificate", CertificateSchema);
