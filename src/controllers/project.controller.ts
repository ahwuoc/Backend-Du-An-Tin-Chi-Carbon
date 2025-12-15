import type { Request, Response } from "express";
import { ProjectService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, BadRequestError } from "../utils";

/**
 * Project Controller
 */
class ProjectController {
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newProject = await ProjectService.create(req.body);
      sendSuccess(res, "Tạo project thành công", newProject, 201);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const updatedProject = await ProjectService.update(id, req.body);
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

      const updatedProject = await ProjectService.updateDocumentsStatus(
        projectId,
        documentId,
        status
      );
      sendSuccess(res, "Cập nhật trạng thái tài liệu thành công", updatedProject, 200);
    }
  );

  public updateDocuments = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { documents } = req.body;

      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const project = await ProjectService.updateDocuments(id, documents);
      sendSuccess(res, "Cập nhật documents thành công", project, 200);
    }
  );

  public updateActivities = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { activities } = req.body;

      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const project = await ProjectService.updateActivities(id, activities);
      sendSuccess(res, "Cập nhật activities thành công", project, 200);
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const projects = await ProjectService.getAll();
      sendSuccess(res, "Lấy danh sách project thành công", projects, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const project = await ProjectService.getById(id);
      sendSuccess(res, "Lấy project thành công", project, 200);
    }
  );

  public getByUserId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("User ID là bắt buộc");

      const projects = await ProjectService.getByUserId(id);
      sendSuccess(res, "Lấy project theo user thành công", projects, 200);
    }
  );
}

export default new ProjectController();
