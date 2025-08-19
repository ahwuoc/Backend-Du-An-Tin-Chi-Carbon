import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is missing.");
  process.exit(1);
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Middleware để xác thực JWT token
 * Hỗ trợ cả Authorization header và cookie
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Lấy token từ Authorization header hoặc cookie
    let token = req.headers.authorization?.split(" ")[1];
    
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({ 
        success: false,
        message: "Không có token xác thực. Vui lòng đăng nhập." 
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Gán user vào request
    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false,
        message: "Token đã hết hạn. Vui lòng đăng nhập lại." 
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false,
        message: "Token không hợp lệ." 
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: "Lỗi xác thực token." 
      });
    }
  }
};

/**
 * Middleware để kiểm tra quyền truy cập dựa trên role
 * @param roles - Mảng các role được phép truy cập
 */
export const hasRole = (roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      res.status(401).json({ 
        success: false,
        message: "Chưa xác thực. Vui lòng đăng nhập." 
      });
      return;
    }

    if (!roles.includes(authReq.user.role)) {
      res.status(403).json({ 
        success: false,
        message: "Không có quyền truy cập. Vui lòng liên hệ admin." 
      });
      return;
    }

    next();
  };
};

/**
 * Middleware để kiểm tra quyền admin
 */
export const requireAdmin = hasRole(["admin"]);

/**
 * Middleware để kiểm tra quyền manager
 */
export const requireManager = hasRole(["admin", "manager"]);

/**
 * Middleware để kiểm tra quyền user (đã đăng nhập)
 */
export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ 
      success: false,
      message: "Chưa xác thực. Vui lòng đăng nhập." 
    });
    return;
  }
  next();
};
