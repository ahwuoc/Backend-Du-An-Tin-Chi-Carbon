import type { Request, Response } from "express";
import { Certificate } from "../models/certificate.model";
import { asyncHandler } from "../middleware";
import { sendSuccess, NotFoundError, BadRequestError } from "../utils";

class CertificateController {
  public getAll = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const certificates = await Certificate.find().lean();
      sendSuccess(res, "Lấy danh sách chứng chỉ thành công", certificates, 200);
    }
  );

  public getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Certificate ID là bắt buộc");

      const cert = await Certificate.findById(id).lean();
      if (!cert) throw new NotFoundError("Không tìm thấy chứng chỉ");

      sendSuccess(res, "Lấy chứng chỉ thành công", cert, 200);
    }
  );

  public create = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const cert = await Certificate.create(req.body);
      sendSuccess(res, "Tạo chứng chỉ thành công", cert, 201);
    }
  );

  public update = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Certificate ID là bắt buộc");

      const updated = await Certificate.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updated) throw new NotFoundError("Không tìm thấy chứng chỉ để cập nhật");

      sendSuccess(res, "Cập nhật chứng chỉ thành công", updated, 200);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Certificate ID là bắt buộc");

      const deleted = await Certificate.findByIdAndDelete(id).lean();
      if (!deleted) throw new NotFoundError("Không tìm thấy chứng chỉ để xóa");

      sendSuccess(res, "Xóa chứng chỉ thành công", deleted, 200);
    }
  );
}

export default new CertificateController();
