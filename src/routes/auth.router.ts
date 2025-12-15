import { Router } from "express";
import rateLimit from "express-rate-limit";
import AuthController from "../controllers/auth.controller";
import { authenticate, hasRole, validateRequest } from "../middleware";
import {
  RegisterDTO,
  LoginDTO,
  ChangePasswordDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  UpdateUserDTO,
} from "../dto";

const router = Router();
const authController = new AuthController();

/**
 * Rate Limiter Factory
 */
const createRateLimiter = (
  message: string,
  windowMs: number = 15 * 60 * 1000,
  max: number = 5
) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Rate limit messages
const RATE_LIMIT = {
  login: "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.",
  forgotPassword: "Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau 1 giờ.",
};

// ==================== PUBLIC ROUTES ====================

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản mới
 * @access  Public
 */
router.post(
  "/register",
  validateRequest(RegisterDTO),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
router.post(
  "/login",
  createRateLimiter(RATE_LIMIT.login, 15 * 60 * 1000, 100),
  validateRequest(LoginDTO),
  authController.login
);

/**
 * @route   GET /api/auth/login/email/:access_token
 * @desc    Xác thực email qua token
 * @access  Public
 */
router.get(
  "/login/email/:access_token",
  authController.LoginEmailAuth
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Gửi email đặt lại mật khẩu
 * @access  Public
 */
router.post(
  "/forgot-password",
  createRateLimiter(RATE_LIMIT.forgotPassword, 60 * 60 * 1000, 5),
  validateRequest(ForgotPasswordDTO),
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Đặt lại mật khẩu
 * @access  Public
 */
router.post(
  "/reset-password",
  validateRequest(ResetPasswordDTO),
  authController.resetPassword
);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất
 * @access  Private
 */
router.post(
  "/logout",
  authenticate,
  authController.logout
);

/**
 * @route   GET /api/auth/users/me
 * @desc    Lấy thông tin user hiện tại
 * @access  Private
 */
router.get(
  "/users/me",
  authenticate,
  authController.getProfile
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Đổi mật khẩu
 * @access  Private
 */
router.post(
  "/change-password",
  authenticate,
  validateRequest(ChangePasswordDTO),
  authController.changePassword
);

// ==================== ADMIN ROUTES ====================

/**
 * @route   GET /api/auth/users
 * @desc    Lấy danh sách tất cả users
 * @access  Admin
 */
router.get(
  "/users",
  authenticate,
  hasRole(["admin"]),
  authController.getAllUser
);

/**
 * @route   PUT /api/auth/users/update
 * @desc    Cập nhật thông tin user (admin)
 * @access  Admin
 */
router.put(
  "/users/update",
  authenticate,
  hasRole(["admin"]),
  validateRequest(UpdateUserDTO),
  authController.changeUser
);

/**
 * @route   DELETE /api/auth/:id
 * @desc    Xóa user
 * @access  Admin
 */
router.delete(
  "/:id",
  authenticate,
  hasRole(["admin"]),
  authController.deleteUserById
);

/**
 * @route   GET /api/auth/user/infor-manger/:id
 * @desc    Lấy thông tin manager
 * @access  Admin
 */
router.get(
  "/user/infor-manger/:id",
  authenticate,
  hasRole(["admin", "manager"]),
  authController.getManagerInfor
);

export default router;
