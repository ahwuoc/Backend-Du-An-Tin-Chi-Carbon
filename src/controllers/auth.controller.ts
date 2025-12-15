import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services";
import { AuthenticatedRequest, asyncHandler } from "../middleware";
import {
  sendSuccess,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils";

export default class AuthController {
  /**
   * Xóa user theo ID
   * DELETE /api/auth/:id
   */
  public deleteUserById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError("User ID là bắt buộc");
      }

      const user = await AuthService.deleteUser(id);
      if (!user) {
        throw new NotFoundError("Người dùng không tìm thấy");
      }

      sendSuccess(res, "Người dùng đã được xóa thành công", user, 200);
    }
  );

  /**
   * Lấy thông tin manager
   * GET /api/auth/user/infor-manger/:id
   */
  public getManagerInfor = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError("User ID là bắt buộc");
      }

      const managerInfo = await AuthService.getManagerInfo(id);
      sendSuccess(res, "Thông tin manager lấy thành công", managerInfo, 200);
    }
  );

  /**
   * Lấy tất cả users
   * GET /api/auth/users
   */
  public getAllUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const users = await AuthService.getAllUsers();
      sendSuccess(res, "Danh sách người dùng lấy thành công", users, 200);
    }
  );

  /**
   * Cập nhật thông tin user (admin)
   * PUT /api/auth/users/update
   */
  public changeUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { _id, name, email, avatar, phone, address, role } = req.body;

      if (!_id || !email) {
        throw new BadRequestError("ID người dùng và email là bắt buộc");
      }

      const updatedUser = await AuthService.updateUser(_id, {
        name,
        email,
        avatar,
        phone,
        address,
        role,
      });

      if (!updatedUser) {
        throw new NotFoundError("Người dùng không tìm thấy");
      }

      sendSuccess(res, "Thông tin người dùng đã được cập nhật", updatedUser, 200);
    }
  );

  /**
   * Đăng ký tài khoản mới
   * POST /api/auth/register
   */
  public register = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, password, name, role = "user" } = req.body;

      // Check if user already exists
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        throw new ConflictError("Email đã được đăng ký");
      }

      // Hash password
      const hashedPassword = await AuthService.hashPassword(password);

      // Create user
      const newUser = await AuthService.createUser({
        email,
        password: hashedPassword,
        name,
        role,
      });

      // Create token
      const token = AuthService.createToken({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role || "user",
      });

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(
        res,
        "Đăng ký thành công",
        {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          token,
        },
        201
      );
    }
  );

  /**
   * Đăng nhập
   * POST /api/auth/login
   */
  public login = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;

      // Find user
      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
      }

      // Check password exists
      if (!user.password) {
        throw new UnauthorizedError("Tài khoản không hợp lệ");
      }

      // Verify password
      const isPasswordValid = await AuthService.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
      }

      // Create token
      const token = AuthService.createToken({
        id: user._id,
        email: user.email,
        role: user.role || "user",
      });

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(
        res,
        "Đăng nhập thành công",
        {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          token,
        },
        200
      );
    }
  );

  /**
   * Đăng xuất
   * POST /api/auth/logout
   */
  public logout = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      res.clearCookie("token");
      sendSuccess(res, "Đăng xuất thành công", null, 200);
    }
  );

  /**
   * Lấy thông tin profile
   * GET /api/auth/profile
   */
  public getProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const authReq = req as AuthenticatedRequest;
      const user = await AuthService.findUserById(authReq.user.id);

      if (!user) {
        throw new NotFoundError("Người dùng không tìm thấy");
      }

      sendSuccess(
        res,
        "Lấy thông tin profile thành công",
        {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          address: user.address,
        },
        200
      );
    }
  );

  /**
   * Cập nhật profile
   * PUT /api/auth/profile
   */
  public updateProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const authReq = req as AuthenticatedRequest;
      const { name, avatar, phone, address } = req.body;

      const updatedUser = await AuthService.updateUser(authReq.user.id, {
        name,
        avatar,
        phone,
        address,
      });

      if (!updatedUser) {
        throw new NotFoundError("Người dùng không tìm thấy");
      }

      sendSuccess(
        res,
        "Cập nhật thông tin thành công",
        {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          phone: updatedUser.phone,
          address: updatedUser.address,
        },
        200
      );
    }
  );

  /**
   * Quên mật khẩu - gửi email reset
   * POST /api/auth/forgot-password
   */
  public forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;

      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        throw new NotFoundError("Email không tồn tại trong hệ thống");
      }

      const resetToken = AuthService.generateResetToken();
      await AuthService.sendResetPasswordEmail(email, resetToken);

      sendSuccess(res, "Email đặt lại mật khẩu đã được gửi", null, 200);
    }
  );

  /**
   * Đặt lại mật khẩu
   * POST /api/auth/reset-password
   */
  public resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { token, newPassword } = req.body;

      const decoded = AuthService.verifyToken(token);
      const user = await AuthService.findUserById(decoded.id);

      if (!user) {
        throw new UnauthorizedError("Token không hợp lệ hoặc đã hết hạn");
      }

      const hashedPassword = await AuthService.hashPassword(newPassword);
      await AuthService.updateUser(user._id, { password: hashedPassword });

      sendSuccess(res, "Đặt lại mật khẩu thành công", null, 200);
    }
  );

  /**
   * Xác thực email qua token
   * GET /api/auth/login/email/:access_token
   */
  public LoginEmailAuth = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { access_token } = req.params;

      const decoded = AuthService.verifyToken(access_token);
      const user = await AuthService.findUserById(decoded.id);

      if (!user) {
        throw new UnauthorizedError("Token không hợp lệ hoặc đã hết hạn");
      }

      sendSuccess(
        res,
        "Xác thực email thành công",
        {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        200
      );
    }
  );

  /**
   * Middleware xác thực token
   * Dùng cho các routes cần authentication
   */
  public authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw new UnauthorizedError("Token không được cung cấp");
      }

      const decoded = AuthService.verifyToken(token);
      const user = await AuthService.findUserById(decoded.id);

      if (!user) {
        throw new UnauthorizedError("Token không hợp lệ");
      }

      (req as AuthenticatedRequest).user = {
        id: user._id,
        email: user.email,
        role: user.role || "user",
      };

      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Đổi mật khẩu
   * POST /api/auth/change-password
   */
  public changePassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const authReq = req as AuthenticatedRequest;
      const { oldPassword, newPassword } = req.body;

      const user = await AuthService.findUserById(authReq.user.id);
      if (!user) {
        throw new NotFoundError("Người dùng không tìm thấy");
      }

      const isPasswordValid = await AuthService.comparePassword(
        oldPassword,
        user.password
      );
      if (!isPasswordValid) {
        throw new BadRequestError("Mật khẩu cũ không đúng");
      }

      const hashedPassword = await AuthService.hashPassword(newPassword);
      await AuthService.updateUser(user._id, { password: hashedPassword });

      sendSuccess(res, "Đổi mật khẩu thành công", null, 200);
    }
  );
}
