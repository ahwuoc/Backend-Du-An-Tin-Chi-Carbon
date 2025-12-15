import { ProjectCarbon } from "../models/project-carbon.model";
import { NotFoundError } from "../utils";
import { Types } from "mongoose";

export interface IProjectCarbonDetails {
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
  riceStartDate?: string | Date | null;
  riceEndDate?: string | Date | null;
  biocharRawMaterial?: string;
  biocharCarbonContent?: string;
  biocharLandArea?: string;
  biocharApplicationMethod?: string;
}

export interface ICreateProjectCarbonInput {
  name: string;
  organization?: string;
  phone: string;
  email: string;
  address?: string;
  projectType: "forest" | "rice" | "biochar";
  details?: IProjectCarbonDetails;
  additionalInfo?: string;
  landDocuments?: string[];
  kmlFile?: string | null;
  userId: Types.ObjectId | string;
}

class ProjectCarbonService {
  async create(data: ICreateProjectCarbonInput) {
    const newProjectData = {
      ...data,
      landDocuments: Array.isArray(data.landDocuments) ? data.landDocuments : [],
      kmlFile: data.kmlFile || null,
      details: { ...(data.details || {}) },
    };

    // Convert date strings to Date objects
    if (typeof newProjectData.details?.riceStartDate === "string") {
      newProjectData.details.riceStartDate = new Date(newProjectData.details.riceStartDate);
    }
    if (typeof newProjectData.details?.riceEndDate === "string") {
      newProjectData.details.riceEndDate = new Date(newProjectData.details.riceEndDate);
    }

    return ProjectCarbon.create(newProjectData);
  }

  async getAll() {
    return ProjectCarbon.find({}).lean();
  }

  async getById(id: string) {
    const project = await ProjectCarbon.findById(id).lean();
    if (!project) {
      throw new NotFoundError("Không tìm thấy project");
    }
    return project;
  }

  async getByUserId(userId: string) {
    return ProjectCarbon.find({ userId }).lean();
  }

  async update(id: string, data: Partial<ICreateProjectCarbonInput>) {
    // Convert date strings to Date objects
    if (data.details?.riceStartDate && typeof data.details.riceStartDate === "string") {
      data.details.riceStartDate = new Date(data.details.riceStartDate);
    }
    if (data.details?.riceEndDate && typeof data.details.riceEndDate === "string") {
      data.details.riceEndDate = new Date(data.details.riceEndDate);
    }

    const project = await ProjectCarbon.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      throw new NotFoundError("Không tìm thấy project");
    }

    return project;
  }

  async delete(id: string) {
    const project = await ProjectCarbon.findByIdAndDelete(id);
    if (!project) {
      throw new NotFoundError("Không tìm thấy project");
    }
    return project;
  }
}

export default new ProjectCarbonService();
