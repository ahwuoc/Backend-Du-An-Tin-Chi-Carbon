import {
  Router,
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
  type ErrorRequestHandler, // Thêm ErrorRequestHandler cho globalErrorHandler
} from "express";
import AuthController from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";
import {
  query,
  body,
  validationResult,
  type ValidationChain,
} from "express-validator";
import { authenticate } from "../middleware/authMiddleware";

interface RequestAuthentication extends Request {
  user?: { id: string; email: string; role: string };
}

const authController = new AuthController();

// Sửa: Đảm bảo hàm trả về void sau khi gửi response hoặc gọi next()
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Thêm kiểu trả về : void
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      // Gửi response
      success: false,
      message: "Dữ liệu đầu vào không hợp lệ.",
      errors: errors.array(),
    });
    return; // Kết thúc hàm sau khi gửi response
  }
  next(); // Gọi middleware tiếp theo
};

const validateRegistration: (ValidationChain | RequestHandler)[] = [
  body("name").notEmpty().withMessage("Thiếu tên người dùng."),
  body("email")
    .notEmpty()
    .withMessage("Thiếu email.")
    .isEmail()
    .withMessage("Email không hợp lệ."),
  body("password")
    .notEmpty()
    .withMessage("Thiếu mật khẩu.")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự."),
  handleValidationErrors,
];

const validateLogin: (ValidationChain | RequestHandler)[] = [
  body("email")
    .notEmpty()
    .withMessage("Thiếu email.")
    .isEmail()
    .withMessage("Email không hợp lệ."),
  body("password").notEmpty().withMessage("Thiếu mật khẩu."),
  handleValidationErrors,
];

const validateForgotPassword: (ValidationChain | RequestHandler)[] = [
  body("email")
    .notEmpty()
    .withMessage("Thiếu email.")
    .isEmail()
    .withMessage("Email không hợp lệ."),
  handleValidationErrors,
];

const validateResetPassword: (ValidationChain | RequestHandler)[] = [
  query("token")
    .notEmpty()
    .withMessage("Thiếu token.")
    .isJWT()
    .withMessage("Token không phải là JWT hợp lệ."),
  body("newPassword")
    .notEmpty()
    .withMessage("Thiếu mật khẩu mới.")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự."),
  handleValidationErrors,
];

const validateChangePassword: (ValidationChain | RequestHandler)[] = [
  body("oldPassword").notEmpty().withMessage("Thiếu mật khẩu cũ."),
  body("newPassword")
    .notEmpty()
    .withMessage("Thiếu mật khẩu mới.")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự.")
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error("Mật khẩu mới phải khác mật khẩu cũ.");
      }
      return true;
    }),
  handleValidationErrors,
];

const validateUpdateUser: (ValidationChain | RequestHandler)[] = [
  body("_id")
    .notEmpty()
    .withMessage("Thiếu ID người dùng.")
    .isMongoId()
    .withMessage("ID người dùng không hợp lệ."),
  body("email").optional().isEmail().withMessage("Email không hợp lệ."),
  body("name").optional().notEmpty().withMessage("Tên không được để trống."),
  body("role")
    .optional()
    .isIn(["user", "admin", "editor"])
    .withMessage("Vai trò không hợp lệ."),
  handleValidationErrors,
];

const limitRequest = (
  message: string,
  windowMs: number = 15 * 60 * 1000,
  maxRequests: number = 5,
): RequestHandler => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const rateLimitMessages = {
  login: "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.",
  register:
    "Quá nhiều tài khoản được tạo từ IP này. Vui lòng thử lại sau 1 giờ.",
  forgotPassword:
    "Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau 1 giờ.",
  generic: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
};

const router = Router();

router.post(
  "/register",
  limitRequest(rateLimitMessages.register, 60 * 60 * 1000, 100),
  validateRegistration,
  authController.register.bind(authController),
);

router.post(
  "/login",
  limitRequest(rateLimitMessages.login, 15 * 60 * 1000, 100),
  validateLogin,
  authController.login.bind(authController),
);

router.get(
  "/login/email/:access_token",
  authController.LoginEmailAuth.bind(authController),
);

router.post(
  "/logout",
  authController.authenticate.bind(authController),
  authController.logout.bind(authController),
);

router.post(
  "/forgot-password",
  limitRequest(rateLimitMessages.forgotPassword, 60 * 60 * 1000, 5),
  validateForgotPassword,
  authController.forgotPassword.bind(authController),
);

router.post(
  "/reset-password",
  validateResetPassword,
  authController.resetPassword.bind(authController),
);

router.post(
  "/change-password",
  authController.authenticate.bind(authController),
  validateChangePassword,
  authController.changePassword.bind(authController),
);
router.get(
  "/users/me",
  authController.authenticate.bind(authController),
  (req: RequestAuthentication, res: Response): void => {
    if (req.user) {
      res.status(200).json({ success: true, user: req.user });
      return; // Kết thúc hàm
    }
    res.status(404).json({
      success: false,
      message: "Không tìm thấy thông tin người dùng.",
    });
    // return; // Có thể thêm return ở đây hoặc để hàm tự kết thúc
  },
);

router.put(
  "/users/update",
  authController.authenticate.bind(authController),
  validateUpdateUser,
  authController.changeUser.bind(authController),
);
const requireAdmin: RequestHandler = (
  req: RequestAuthentication,
  res: Response,
  next: NextFunction,
): void => {
  // Thêm kiểu trả về : void (hoặc để TypeScript tự suy luận nếu thân hàm đúng)
  if (req.user && req.user.role === "admin") {
    next();
    return;
  }
  res.status(403).json({
    success: false,
    message: "Không có quyền truy cập. Yêu cầu quyền quản trị viên.",
  });
};

router.get("/users", authController.getAllUser.bind(authController));
router.delete("/:id", authController.deleteUserById.bind(authController));

router.get(
  "/user/infor-manger/:id",
  authController.getManagerInfor.bind(authController),
);
const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("🚨 GLOBAL ERROR HANDLER CAUGHT:", err.stack || err);
  if (res.headersSent) {
    return next(err);
  }
  if (err.status) {
    res.status(err.status).json({ success: false, message: err.message });
    return;
  }
  if (err.name === "UnauthorizedError") {
    res
      .status(401)
      .json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn." });
    return;
  }
  res.status(500).json({
    success: false,
    message: "Lỗi máy chủ nội bộ. Chúng tôi đang cố gắng khắc phục!",
  });
};
router.use(globalErrorHandler);
export default router;
