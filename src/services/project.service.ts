import mongoose from "mongoose";
import { Project } from "../models/project.model";
import { ProjectCarbon } from "../models/project-carbon.model";
import { NotFoundError, BadRequestError, ValidationError } from "../utils";

export interface ICreateProjectInput {
  name: string;
  description?: string;
  status?: "pending" | "active" | "completed" | "cancelled";
  registrationDate?: Date;
  startDate?: Date;
  endDate?: Date;
  carbonCredits?: number;
  carbonCreditsTotal?: number;
  carbonCreditsClaimed?: number;
  type?: string;
  location?: string;
  coordinates?: any;
  area?: number;
  participants?: any[];
  progress?: number;
  documents?: any[];
  activities?: any[];
  userId?: string;
}

class ProjectService {
  async create(data: ICreateProjectInput) {
    return Project.create(data);
  }

  async getAll() {
    return ProjectCarbon.find().populate("userId").lean();
  }

  async getById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Project ID không hợp lệ");
    }

    const project = await ProjectCarbon.findById(id).populate("userId");
    if (!project) {
      throw new NotFoundError("Không tìm thấy project");
    }
    return project;
  }

  async getByUserId(userId: string) {
    return ProjectCarbon.find({ userId }).lean();
  }

  async update(id: string, data: Partial<ICreateProjectInput>) {
    const updatedProject = await ProjectCarbon.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      throw new NotFoundError("Không tìm thấy project");
    }

    return updatedProject;
  }

  async updateDocumentsStatus(projectId: string, documentId: string, status: string) {
    const validStatuses = ["rejected", "approved", "pending"];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(
        `Giá trị 'status' không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(", ")}`
      );
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, "documents._id": documentId },
      { $set: { "documents.$.status": status } },
      { new: true }
    );

    if (!updatedProject) {
      throw new NotFoundError("Không tìm thấy project hoặc document");
    }

    return updatedProject;
  }

  async updateDocuments(id: string, documents: any[]) {
    if (!Array.isArray(documents)) {
      throw new ValidationError("documents phải là một mảng");
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { documents },
      { new: true, runValidators: true }
    );

    if (!project) {
      throw new NotFoundError("Không tìm thấy project");
    }

    return project;
  }

  async updateActivities(id: string, activities: any[]) {
    if (!Array.isArray(activities)) {
      throw new ValidationError("activities phải là một mảng");
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { activities },
      { new: true, runValidators: true }
    );

    if (!project) {
      throw new NotFoundError("Không tìm thấy project");
    }

    return project;
  }

  async delete(id: string) {
    const deleted = await ProjectCarbon.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundError("Không tìm thấy project");
    }
    return deleted;
  }
}

export default new ProjectService();
