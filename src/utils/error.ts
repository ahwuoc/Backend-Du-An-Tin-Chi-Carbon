import { HttpStatusCode } from "axios";
import { HttpStatus } from "./constants";

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public errorCode?: string
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor)

    }
}

// Handle case 400 bad request
export class BadRequestError extends AppError {
    constructor(message: string = "Dữ liệu không hợp lệ", errorCode?: string
    ) {
        super(message, HttpStatusCode.BadRequest, errorCode || "BAD_REQUEST")
    }
}

// Handle case 401 Unauthorized
export class UnauthorizedError extends AppError {
    constructor(message: string = "Chưa xác thực , vui lòng đăng nhập", errorCode?: string) {
        super(message, HttpStatusCode.Unauthorized, errorCode || "UNAUTHORIZED")
    }
}
// Handle case 403 Forbidden
export class ForbiddenError extends AppError {
    constructor(message: string = "Không có quyền truy cập", errCode?: string) {
        super(message, HttpStatusCode.Forbidden, errCode || "FORBIDDEN")
    };
}
// Handle case 404 Not Found
export class NotFoundError extends AppError {
    constructor(message: string = "Không tìm thấy", errorCode?: string) {
        super(message, 404, errorCode || "NOT_FOUND")
    }
}
// Handle case 409 conflict 

export class ConflicError extends AppError{
    constructor(message:string="Dữ liệu đã tồn tại",errorCode?:string){
          super(message,409,errorCode)

    }
}

// Handle case 422 : Validation error
export class ValidationError extends AppError {
  constructor(
    message: string = "Dữ liệu không hợp lệ",
    public details?: any,
    errorCode?: string
  ) {
    super(message, 422, errorCode || "VALIDATION_ERROR");
  }
}


//  Handle case 500 Internal Server Error
export class InternalServerError extends AppError {
  constructor(message: string = "Lỗi máy chủ nội bộ", errorCode?: string) {
    super(message, 500, errorCode || "INTERNAL_SERVER_ERROR");
  }
}