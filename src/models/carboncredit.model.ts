import { Schema, model, models, Document } from "mongoose";

interface CarbonCreditDoc extends Document {
  title: string;
  location: string;
  area: string;
  startDate: string;
  endDate: string;
  totalCredits: string;
  usedCredits: string;
  remainingCredits: string;
  status: string;
  description: string;
  image: string;
  afterImage: string;
  projectManager: string;
  projectContact: string;
  projectPhone: string;
  verificationDate: string;
  nextVerificationDate: string;
  verificationBody: string;
  communityBenefits: string[];
  biodiversityBenefits: string[];
  reports: {
    title: string;
    date: string;
    size: string;
    type: string;
  }[];
  transactions: {
    date: string;
    type: string;
    amount: string;
    value: string;
    purpose?: string;
    recipient?: string;
    status: string;
  }[];
  certificates: {
    title: string;
    date: string;
    size: string;
  }[];
  timeline: {
    date: string;
    event: string;
    upcoming?: boolean;
  }[];
}

const ReportSchema = new Schema(
  {
    title: String,
    date: String,
    size: String,
    type: String,
  },
  { _id: false }
);

const TransactionSchema = new Schema(
  {
    date: String,
    type: String,
    amount: String,
    value: String,
    purpose: String,
    recipient: String,
    status: String,
  },
  { _id: false }
);

const CertificateSchema = new Schema(
  {
    title: String,
    date: String,
    size: String,
  },
  { _id: false }
);

const TimelineSchema = new Schema(
  {
    date: String,
    event: String,
    upcoming: Boolean,
  },
  { _id: false }
);

const CarbonCreditSchema = new Schema<CarbonCreditDoc>({
  title: { type: String, required: true },
  location: { type: String, required: true },
  area: String,
  startDate: String,
  endDate: String,
  totalCredits: String,
  usedCredits: String,
  remainingCredits: String,
  status: String,
  description: String,
  image: String,
  afterImage: String,
  projectManager: String,
  projectContact: String,
  projectPhone: String,
  verificationDate: String,
  nextVerificationDate: String,
  verificationBody: String,
  communityBenefits: [String],
  biodiversityBenefits: [String],
  reports: [ReportSchema],
  transactions: [TransactionSchema],
  certificates: [CertificateSchema],
  timeline: [TimelineSchema],
});

const CarbonCredit =
  models.CarbonCredit ||
  model<CarbonCreditDoc>("CarbonCredit", CarbonCreditSchema);

export default CarbonCredit;
