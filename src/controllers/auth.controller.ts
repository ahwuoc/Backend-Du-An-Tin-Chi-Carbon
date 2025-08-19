import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services";

import { AuthenticatedRequest } from "../middleware/authMiddleware";

type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

export default class AuthController {
  public async deleteUserById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await AuthService.deleteUser(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({
        message: "User deleted successfully",
        data: user,
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getManagerInfor(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const managerInfo = await AuthService.getManagerInfo(userId);
      res.json(managerInfo);
    } catch (error) {
      console.error("Error in getManagerInfor:", error);
      res.status(500).json({ error: "Server error", details: error });
    }
  }

  public async getAllUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await AuthService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  public async changeUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { _id, name, email, avatar, phone, address, role } = req.body;
      if (!_id || !email) {
        res
          .status(400)
          .json({ success: false, message: "Thiếu ID người dùng hoặc email." });
        return;
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
        res
          .status(404)
          .json({ success: false, message: "Người dùng không tìm thấy." });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Thông tin người dùng đã được cập nhật.",
        user: updatedUser,
      });
    } catch (err: any) {
      console.error("Lỗi khi cập nhật người dùng:", err);
      if (err.name === "ValidationError") {
        res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ.",
          errors: err.errors,
        });
        return;
      }
      res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ." });
    }
  }



  public register: ExpressHandler = async (req, res, next) => {
    const { email, password, name, role = "user" } = req.body;
    const errors = await AuthService.validateRegistration(req.body);
    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      res.status(400).json({
        success: false,
        message: "Đăng ký thất bại - Dữ liệu không hợp lệ",
        errors: errors,
        receivedData: {
          email: email ? "provided" : "missing",
          password: password ? "provided" : "missing", 
          name: name ? "provided" : "missing",
          role: role
        }
      });
      return;
    }

    try {
      const hashedPassword = await AuthService.hashPassword(password);
      const newUser = await AuthService.createUser({
        email,
        password: hashedPassword,
        name,
        role,
      });

      const token = AuthService.createToken({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

      res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        token,
      });
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      if (error.message.includes("đã tồn tại")) {
        res.status(400).json({
          success: false,
          message: error.message,
          errorType: "DUPLICATE_EMAIL"
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ nội bộ",
        error: error.message
      });
    }
  };

  public login: ExpressHandler = async (req, res, next) => {
    const { email, password } = req.body;
    
    console.log("Login request body:", req.body);
    
    const errors = await AuthService.validateLogin(req.body);
    if (errors.length > 0) {
      console.log("Login validation errors:", errors);
      res.status(400).json({
        success: false,
        message: "Đăng nhập thất bại - Dữ liệu không hợp lệ",
        errors: errors,
        receivedData: {
          email: email ? "provided" : "missing",
          password: password ? "provided" : "missing"
        }
      });
      return;
    }

    try {
      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng",
          errorType: "INVALID_CREDENTIALS"
        });
        return;
      }

      console.log("User found:", { 
        id: user._id, 
        email: user.email, 
        hasPassword: !!user.password,
        passwordType: typeof user.password 
      });

      if (!user.password) {
        res.status(401).json({
          success: false,
          message: "Tài khoản không hợp lệ - thiếu mật khẩu",
          errorType: "INVALID_ACCOUNT"
        });
        return;
      }

      const isPasswordValid = await AuthService.comparePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng",
          errorType: "INVALID_CREDENTIALS"
        });
        return;
      }

      const token = AuthService.createToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ nội bộ",
      });
    }
  };

  public logout: ExpressHandler = async (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  };

  public getProfile: AuthenticatedHandler = async (req, res, next) => {
    try {
      const user = await AuthService.findUserById(req.user.id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Người dùng không tìm thấy",
        });
        return;
      }

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          address: user.address,
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin profile:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ nội bộ",
      });
    }
  };

  public updateProfile: AuthenticatedHandler = async (req, res, next) => {
    try {
      const { name, avatar, phone, address } = req.body;
      const updatedUser = await AuthService.updateUser((req as any).user.id, {
        name,
        avatar,
        phone,
        address,
      });

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: "Người dùng không tìm thấy",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công",
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          phone: updatedUser.phone,
          address: updatedUser.address,
        },
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ nội bộ",
      });
    }
  };

  public forgotPassword: ExpressHandler = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Email không tồn tại trong hệ thống",
        });
        return;
      }

      const resetToken = AuthService.generateResetToken();
      await AuthService.sendResetPasswordEmail(email, resetToken);

      res.status(200).json({
        success: true,
        message: "Email đặt lại mật khẩu đã được gửi",
      });
    } catch (error) {
      console.error("Lỗi khi gửi email đặt lại mật khẩu:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ nội bộ",
      });
    }
  };

  public resetPassword: ExpressHandler = async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const decoded = AuthService.verifyToken(token);
      const user = await AuthService.findUserById(decoded.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Token không hợp lệ",
        });
        return;
      }

      const hashedPassword = await AuthService.hashPassword(newPassword);
      await AuthService.updateUser(user._id, { password: hashedPassword });

      res.status(200).json({
        success: true,
        message: "Đặt lại mật khẩu thành công",
      });
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);
      res.status(400).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
  };

  public LoginEmailAuth: ExpressHandler = async (req, res, next) => {
    try {
      const { access_token } = req.params;
      const decoded = AuthService.verifyToken(access_token);
      const user = await AuthService.findUserById(decoded.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Token không hợp lệ",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Xác thực email thành công",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Lỗi khi xác thực email:", error);
      res.status(400).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
  };

  public authenticate: ExpressHandler = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Token không được cung cấp",
        });
        return;
      }

      const decoded = AuthService.verifyToken(token);
      const user = await AuthService.findUserById(decoded.id);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Token không hợp lệ",
        });
        return;
      }

      (req as any).user = {
        id: user._id,
        email: user.email,
        role: user.role,
      };
      next();
    } catch (error) {
      console.error("Lỗi khi xác thực:", error);
      res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }
  };

  public changePassword: AuthenticatedHandler = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await AuthService.findUserById(req.user.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Người dùng không tìm thấy",
        });
        return;
      }

      const isPasswordValid = await AuthService.comparePassword(oldPassword, user.password);
      if (!isPasswordValid) {
        res.status(400).json({
          success: false,
          message: "Mật khẩu cũ không đúng",
        });
        return;
      }

      const hashedPassword = await AuthService.hashPassword(newPassword);
      await AuthService.updateUser(user._id, { password: hashedPassword });

      res.status(200).json({
        success: true,
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ nội bộ",
      });
    }
  };
}
