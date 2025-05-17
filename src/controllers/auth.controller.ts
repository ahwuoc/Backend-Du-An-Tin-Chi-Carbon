import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { sendEmail } from "../utils/sendEmail";
import { resetPasswordContent } from "../utils/emailTemplates";
import { UserModel } from "../models/users.model";
import axios from "axios";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is missing.");
  process.exit(1);
}

interface RequestAuthentication extends Request {
  user?: { id: string; email: string; role: string };
}

type ExpressHandler = (
  req: RequestAuthentication,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

class AuthController {
  private userModel = UserModel;

  private createToken(
    payload: object,
    expiresIn: string = JWT_EXPIRES_IN
  ): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
  }

  private async handleUserExistenceAndPasswordHashing(
    email: string,
    password: string
  ): Promise<string> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error("Người dùng đã tồn tại với email này.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  public async getAllUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this.userModel.find().select("-password").lean();
      console.log("Lỗi khi lấy danh sách user:");
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
    next: NextFunction
  ): Promise<void> {
    try {
      const { _id, name, email, avatar, phone, address, role } = req.body;
      if (!_id || !email) {
        res
          .status(400)
          .json({ success: false, message: "Thiếu ID người dùng hoặc email." });
        return;
      }
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          _id,
          { name, email, avatar, phone, address, role },
          { new: true, runValidators: true }
        )
        .select("-password");

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

  public authenticate: ExpressHandler = async (req, res, next) => {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Không có token xác thực. Vui lòng đăng nhập.",
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
      };
      req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
      next();
    } catch (error) {
      console.error("Lỗi xác thực token:", error);
      res
        .status(401)
        .json({ success: false, error: "Token không hợp lệ hoặc đã hết hạn." });
    }
  };

  public register: ExpressHandler = async (req, res, next) => {
    const { email, password, name, role = "user" } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        error: "Thiếu thông tin bắt buộc (email, password, name).",
      });
      return;
    }
    if (!validator.isEmail(email)) {
      res.status(400).json({ success: false, error: "Email không hợp lệ." });
      return;
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ success: false, error: "Mật khẩu phải có ít nhất 6 ký tự." });
      return;
    }

    try {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: "Người dùng đã tồn tại với email này.",
        });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userModel.create({
        email,
        password: hashedPassword,
        name,
        role,
        createdAt: new Date(),
      });
      if (!newUser) {
        res.status(409).json({
          success: false,
          error: "Đăng ký thất bại vui lòng thử lại",
        });
        return;
      }
      res.status(201).json({
        success: true,
        message: "Đăng ký thành công! Bạn có thể đăng nhập ngay.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
      return;
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Lỗi hệ thống khi đăng ký.",
      });
    }
  };

  public async LoginEmailAuth(
    req: RequestAuthentication,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const googleAccessToken = req.params.access_token;
    if (!googleAccessToken) {
      res.status(400).json({
        success: false,
        error: "Google access token không được cung cấp.",
      });
      return;
    }

    try {
      console.log("📡 Đang gọi Google API để lấy thông tin người dùng...");
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        }
      );

      const googleUserData = userInfoResponse.data;
      if (!googleUserData || !googleUserData.email) {
        res.status(400).json({
          success: false,
          error:
            "Không thể lấy thông tin người dùng từ Google hoặc email bị thiếu.",
        });
        return;
      }
      let user = await this.userModel.findOne({
        email: googleUserData.email,
      });
      let isNewUser = false;
      if (!user) {
        const randomPassword = Math.random().toString(36).slice(-8) + "G!";
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        user = await this.userModel.create({
          email: googleUserData.email,
          name: googleUserData.name || googleUserData.given_name,
          avatar: googleUserData.picture,
          password: hashedPassword,
          role: "user",
          isVerified: googleUserData.email_verified,
          provider: "google",
        });
        isNewUser = true;
      } else {
        let changed = false;
        if (user.avatar && googleUserData.picture) {
          user.avatar = googleUserData.picture;
          changed = true;
        }
        if (changed) {
          await user.save();
        }
      }
      const userPayloadForToken = {
        userId: user!._id.toString(),
        email: user!.email,
        role: user!.role,
        name: user!.name,
      };
      const token = this.createToken(userPayloadForToken, JWT_EXPIRES_IN);
      res.cookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(isNewUser ? 201 : 200).json({
        success: true,
        token,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: "Lỗi hệ thống khi xử lý đăng nhập Google.",
      });
    }
  }

  public login: ExpressHandler = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, error: "Thiếu email hoặc mật khẩu." });
      return;
    }
    try {
      const user = await this.userModel.findOne({ email }).select("+password");
      if (!user) {
        res
          .status(401)
          .json({ success: false, error: "Email hoặc mật khẩu không đúng." });
        return;
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        res
          .status(401)
          .json({ success: false, error: "Email hoặc mật khẩu không đúng." });
        return;
      }
      const userPayloadForToken = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      };
      const token = this.createToken(userPayloadForToken, JWT_EXPIRES_IN);

      res.cookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công!",
        token,
      });
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      res
        .status(500)
        .json({ success: false, error: "Lỗi máy chủ nội bộ khi đăng nhập." });
    }
  };

  public forgotPassword: ExpressHandler = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        success: false,
        error: "Vui lòng nhập địa chỉ email của bạn.",
      });
      return;
    }
    if (!validator.isEmail(email)) {
      res
        .status(400)
        .json({ success: false, error: "Địa chỉ email không hợp lệ." });
      return;
    }

    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        res.status(200).json({
          success: true,
          message:
            "Nếu email của bạn tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã được gửi.",
        });
        return;
      }

      const resetTokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        type: "PASSWORD_RESET",
      };
      const resetToken = this.createToken(resetTokenPayload, "15m");

      const resetLink = `${
        process.env.FRONT_END_URL || "http://localhost:3000"
      }/reset-password?token=${resetToken}`;

      const emailHtmlContent = resetPasswordContent(resetLink);

      await sendEmail(email, "Yêu cầu đặt lại mật khẩu", emailHtmlContent);

      res.status(200).json({
        success: true,
        message:
          "Nếu email của bạn tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã được gửi.",
      });
    } catch (error: any) {
      console.error("Lỗi quên mật khẩu:", error);
      res.status(500).json({
        success: false,
        error: "Lỗi máy chủ nội bộ khi xử lý yêu cầu quên mật khẩu.",
      });
    }
  };

  public resetPassword: ExpressHandler = async (req, res, next) => {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token || typeof token !== "string") {
      res
        .status(400)
        .json({ success: false, error: "Thiếu token đặt lại mật khẩu." });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({
        success: false,
        error: "Mật khẩu mới không hợp lệ (phải có ít nhất 6 ký tự).",
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        type?: string;
      };

      if (decoded.type !== "PASSWORD_RESET") {
        res.status(400).json({
          success: false,
          error: "Token không hợp lệ cho việc đặt lại mật khẩu.",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await this.userModel.findByIdAndUpdate(
        decoded.userId,
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error:
            "Không tìm thấy người dùng để đặt lại mật khẩu hoặc token không hợp lệ.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message:
          "Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập bằng mật khẩu mới.",
      });
    } catch (err: any) {
      console.error("Lỗi đặt lại mật khẩu:", err);
      if (err.name === "TokenExpiredError") {
        res.status(400).json({
          success: false,
          error: "Token đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.",
        });
        return;
      }
      if (err.name === "JsonWebTokenError") {
        res.status(400).json({
          success: false,
          error: "Token đặt lại mật khẩu không hợp lệ.",
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: "Lỗi máy chủ nội bộ khi đặt lại mật khẩu.",
      });
    }
  };

  public changePassword: ExpressHandler = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: "Cả mật khẩu cũ và mật khẩu mới đều là bắt buộc.",
      });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        error: "Mật khẩu mới phải có ít nhất 6 ký tự.",
      });
      return;
    }
    if (oldPassword === newPassword) {
      res
        .status(400)
        .json({ success: false, error: "Mật khẩu mới phải khác mật khẩu cũ." });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Người dùng chưa được xác thực.",
      });
      return;
    }

    try {
      const user = await this.userModel.findById(userId).select("+password");

      if (!user) {
        res
          .status(404)
          .json({ success: false, error: "Người dùng không tìm thấy." });
        return;
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        res
          .status(400)
          .json({ success: false, error: "Mật khẩu cũ không chính xác." });
        return;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Mật khẩu đã được thay đổi thành công.",
      });
    } catch (error: any) {
      console.error("Lỗi đổi mật khẩu:", error);
      res.status(500).json({
        success: false,
        error: "Lỗi máy chủ nội bộ khi đổi mật khẩu.",
      });
    }
  };

  public logout: ExpressHandler = async (req, res, next) => {
    res.cookie("token", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });
    res.status(200).json({ success: true, message: "Đăng xuất thành công." });
  };
}

export default AuthController;
