import { Document } from "mongoose";
interface IProject extends Document {
  name: string;
  description: string;
  status: string;
  registrationDate: Date;
  startDate: Date;
  endDate: Date;
  carbonCredits: number;
  carbonCreditsTotal: number;
  carbonCreditsClaimed: number;
  type: string;
  location: string;
  coordinates: string;
  area: number;
  participants: number;
  progress: number;
  documents: { name: string; date: Date; type: string }[];
  activities: { date: Date; description: string }[];
}
