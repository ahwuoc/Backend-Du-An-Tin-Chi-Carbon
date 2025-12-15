import type { Request, Response } from "express";
import { ProjectCarbon } from "../models/project-carbon.model";
import { Types } from "mongoose";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError } from "../utils";

interface ProjectCarbonInputData {
  name: string;
  organization?: string;
  phone: string;
  email: string;
  address?: string;
  projectType: "forest" | "rice" | "biochar";
  details?: {
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
  };
  additionalInfo?: string;
  landDocuments?: string[];
  kmlFile?: string | null;
  userId: Types.ObjectId | string;
}

class ProjectCarbonController {
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { landDocuments, kmlFile, ...restBody } = req.body;

      const newProjectData: ProjectCarbonInputData = {
        ...restBody,
        landDocuments: Array.isArray(landDocuments) ? landDocuments : [],
        kmlFile: kmlFile || null,
        details: { ...(restBody.details || {}) },
      };

      // Convert date strings to Date objects
      if (typeof newProjectData.details?.riceStartDate === "string") {
        newProjectData.details.riceStartDate = new Date(newProjectData.details.riceStartDate);
      }
      if (typeof newProjectData.details?.riceEndDate === "string") {
        newProjectData.details.riceEndDate = new Date(newProjectData.details.riceEndDate);
      }

      const project = await ProjectCarbon.create(newProjectData);
      sendSuccess(res, "Tạo project carbon thành công", project, 201);
    }
  );

  public getByUserId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("User ID là bắt buộc");

      const projects = await ProjectCarbon.find({ userId: id }).lean();
      sendSuccess(res, "Lấy project theo user thành công", projects, 200);
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const projects = await ProjectCarbon.find({}).lean();
      sendSuccess(res, "Lấy danh sách project carbon thành công", projects, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const project = await ProjectCarbon.findById(id).lean();
      if (!project) throw new NotFoundError("Không tìm thấy project");

      sendSuccess(res, "Lấy project carbon thành công", project, 200);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const updateData = req.body as ProjectCarbonInputData;

      // Convert date strings to Date objects
      if (updateData.details?.riceStartDate && typeof updateData.details.riceStartDate === "string") {
        updateData.details.riceStartDate = new Date(updateData.details.riceStartDate);
      }
      if (updateData.details?.riceEndDate && typeof updateData.details.riceEndDate === "string") {
        updateData.details.riceEndDate = new Date(updateData.details.riceEndDate);
      }

      const project = await ProjectCarbon.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!project) throw new NotFoundError("Không tìm thấy project");

      sendSuccess(res, "Cập nhật project carbon thành công", project, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const project = await ProjectCarbon.findByIdAndDelete(id);
      if (!project) throw new NotFoundError("Không tìm thấy project");

      sendSuccess(res, "Xóa project carbon thành công", project, 200);
    }
  );
}

export default new ProjectCarbonController();
