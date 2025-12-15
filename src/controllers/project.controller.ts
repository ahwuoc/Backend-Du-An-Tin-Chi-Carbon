import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/project.model";
import { ProjectCarbon } from "../models/project-carbon.model";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError, ValidationError } from "../utils";

class ProjectController {
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newProject = await Project.create(req.body);
      sendSuccess(res, "Tạo project thành công", newProject, 201);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const updatedProject = await ProjectCarbon.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedProject) throw new NotFoundError("Không tìm thấy project");

      sendSuccess(res, "Cập nhật project thành công", updatedProject, 200);
    }
  );

  public updateDocumentsStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { projectId, documentId } = req.params;
      const { status } = req.query;

      if (typeof status !== "string") {
        throw new BadRequestError("`status` phải là kiểu chuỗi (string)");
      }

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

      sendSuccess(res, "Cập nhật trạng thái tài liệu thành công", updatedProject, 200);
    }
  );

  public updateDocuments = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { documents } = req.body;

      if (!id) throw new BadRequestError("Project ID là bắt buộc");
      if (!Array.isArray(documents)) {
        throw new ValidationError("documents phải là một mảng");
      }

      const project = await Project.findByIdAndUpdate(
        id,
        { documents },
        { new: true, runValidators: true }
      );

      if (!project) throw new NotFoundError("Không tìm thấy project");

      sendSuccess(res, "Cập nhật documents thành công", project, 200);
    }
  );

  public updateActivities = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { activities } = req.body;

      if (!id) throw new BadRequestError("Project ID là bắt buộc");
      if (!Array.isArray(activities)) {
        throw new ValidationError("activities phải là một mảng");
      }

      const project = await Project.findByIdAndUpdate(
        id,
        { activities },
        { new: true, runValidators: true }
      );

      if (!project) throw new NotFoundError("Không tìm thấy project");

      sendSuccess(res, "Cập nhật activities thành công", project, 200);
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const projects = await ProjectCarbon.find().populate("userId").lean();
      sendSuccess(res, "Lấy danh sách project thành công", projects, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Project ID không hợp lệ");
      }

      const project = await ProjectCarbon.findById(id).populate("userId");
      if (!project) throw new NotFoundError("Không tìm thấy project");

      sendSuccess(res, "Lấy project thành công", project, 200);
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
}

export default new ProjectController();
