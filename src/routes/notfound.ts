import { Request, Response } from "express";

export const notFoundHandler = (req: Request, res: Response) => {
  console.log(`🚨 404: Không tìm thấy route ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: "404 Not Found",
  });
};
