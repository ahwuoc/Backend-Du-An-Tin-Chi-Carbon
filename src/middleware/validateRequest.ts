import type { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ValidationError } from "../utils/error";


export const validateRequest = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToInstance(dtoClass, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}).join(", "))
          .flat();
        throw new ValidationError("Dữ liệu không hợp lệ", messages);
      }
      req.body = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
};
