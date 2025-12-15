import type { Request, Response } from "express";
import { CertificateService } from "../services";
import { asyncHandler } from "../middleware";
import { sendSuccess, BadRequestError } from "../utils";

/**
 * Certificate Controller
 */
class CertificateController {
  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const certificates = await CertificateService.getAll();
      sendSuccess(res, "Lấy danh sách chứng chỉ thành công", certificates, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Certificate ID là bắt buộc");

      const cert = await CertificateService.getById(id);
      sendSuccess(res, "Lấy chứng chỉ thành công", cert, 200);
    }
  );

  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const cert = await CertificateService.create(req.body);
      sendSuccess(res, "Tạo chứng chỉ thành công", cert, 201);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Certificate ID là bắt buộc");

      const updated = await CertificateService.update(id, req.body);
      sendSuccess(res, "Cập nhật chứng chỉ thành công", updated, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Certificate ID là bắt buộc");

      const deleted = await CertificateService.delete(id);
      sendSuccess(res, "Xóa chứng chỉ thành công", deleted, 200);
    }
  );
}

export default new CertificateController();
