import type { Request,Response, NextFunction } from "express";
import { AppError } from "../utils/error";
import { sendError } from "../utils/response";

export const errorHandle = (
    error:Error,
    req:Request,
    res:Response,
    next:NextFunction
):void =>{
    console.log("Error caught by error Handler:",{
        name:error.name,
        message:error.message,
        stack:error.stack       
    })
    if(error instanceof AppError){
        sendError(res,error.message,error.statusCode,error.errorCode)
        return;
    }
    sendError(res,"Lỗi máy chủ nội bộ",500,process.env.NODE_ENV === "production" ? undefined : error.message)
}
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};