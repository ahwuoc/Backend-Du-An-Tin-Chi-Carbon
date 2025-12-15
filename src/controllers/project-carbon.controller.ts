import type { Request, Response } from "express";
import { ProjectCarbonService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, BadRequestError } from "../utils";

/**
 * Project Carbon Controller
 */
class ProjectCarbonController {
  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const project = await ProjectCarbonService.create(req.body);
      sendSuccess(res, "Tạo project carbon thành công", project, 201);
    }
  );

  public getByUserId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("User ID là bắt buộc");

      const projects = await ProjectCarbonService.getByUserId(id);
      sendSuccess(res, "Lấy project theo user thành công", projects, 200);
    }
  );

  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const projects = await ProjectCarbonService.getAll();
      sendSuccess(res, "Lấy danh sách project carbon thành công", projects, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const project = await ProjectCarbonService.getById(id);
      sendSuccess(res, "Lấy project carbon thành công", project, 200);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const project = await ProjectCarbonService.update(id, req.body);
      sendSuccess(res, "Cập nhật project carbon thành công", project, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Project ID là bắt buộc");

      const project = await ProjectCarbonService.delete(id);
      sendSuccess(res, "Xóa project carbon thành công", project, 200);
    }
  );
}

export default new ProjectCarbonController();
