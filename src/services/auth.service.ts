import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email/sendEmail";
import { resetPasswordContent } from "../utils/email/emailTemplates";
import { UserModel, IUser } from "../models/users.model";
import Order from "../models/order.model";
import { ProjectCarbon } from "../models/project-carbon.model";
import { config } from "../config/env";

// ==================== TYPES ====================

/**
 * JWT Payload interface
 */
export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * User Document with _id
 */
export interface IUserDocument extends IUser {
  _id: any; // MongoDB ObjectId
}

/**
 * Create User Input
 */
export interface ICreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: "user" | "admin" | "editor";
}

/**
 * Update User Input
 */
export interface IUpdateUserInput {
  name?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  role?: "user" | "admin" | "editor";
  password?: string;
}

/**
 * Manager Info Response
 */
export interface IManagerInfo {
  orders: any[];
  projects: any[];
}

// ==================== SERVICE ====================

export class AuthService {
  private readonly SALT_ROUNDS = 10;

  /**
   * Tạo JWT token
   * @param payload - Data để encode vào token
   * @param expiresIn - Thời gian hết hạn (default từ config)
   */
  public createToken(payload: IJwtPayload, expiresIn?: string): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: expiresIn || config.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   * @param token - JWT token cần verify
   * @returns Decoded payload
   */
  public verifyToken(token: string): IJwtPayload {
    return jwt.verify(token, config.JWT_SECRET) as IJwtPayload;
  }

  /**
   * Hash password
   * @param password - Plain text password
   */
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * So sánh password
   * @param password - Plain text password
   * @param hashedPassword - Hashed password từ database
   */
  public async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Tạo user mới
   * @param userData - Dữ liệu user
   */
  public async createUser(userData: ICreateUserInput): Promise<IUserDocument> {
    const user = await UserModel.create(userData);
    return user.toObject() as IUserDocument;
  }

  /**
   * Tìm user theo ID
   * @param id - User ID
   */
  public async findUserById(id: string): Promise<IUserDocument | null> {
    const user = await UserModel.findById(id).select("-password").lean();
    return user as IUserDocument | null;
  }

  /**
   * Tìm user theo email (bao gồm password để verify)
   * @param email - User email
   */
  public async findUserByEmail(email: string): Promise<IUserDocument | null> {
    const user = await UserModel.findOne({ email }).select("+password").lean();
    return user as IUserDocument | null;
  }

  /**
   * Kiểm tra email đã tồn tại chưa
   * @param email - Email cần kiểm tra
   */
  public async isEmailExists(email: string): Promise<boolean> {
    const user = await UserModel.findOne({ email }).lean();
    return !!user;
  }

  /**
   * Cập nhật user
   * @param id - User ID
   * @param updateData - Dữ liệu cần update
   */
  public async updateUser(
    id: string,
    updateData: IUpdateUserInput
  ): Promise<IUserDocument | null> {
    const user = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .lean();
    return user as IUserDocument | null;
  }

  /**
   * Xóa user
   * @param id - User ID
   */
  public async deleteUser(id: string): Promise<IUserDocument | null> {
    const user = await UserModel.findByIdAndDelete(id).lean();
    return user as IUserDocument | null;
  }

  /**
   * Lấy tất cả users
   */
  public async getAllUsers(): Promise<IUserDocument[]> {
    const users = await UserModel.find().select("-password").lean();
    return users as IUserDocument[];
  }

  /**
   * Lấy thông tin manager (orders + projects)
   * @param userId - User ID
   */
  public async getManagerInfo(userId: string): Promise<IManagerInfo> {
    const [orders, projects] = await Promise.all([
      Order.find({ userId }).populate("productId").lean(),
      ProjectCarbon.find({ userId }).lean(),
    ]);
    return { orders, projects };
  }

  /**
   * Gửi email reset password
   * @param email - Email người nhận
   * @param resetToken - Token reset password
   */
  public async sendResetPasswordEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailContent = resetPasswordContent(resetUrl);
    await sendEmail(email, "Đặt lại mật khẩu", emailContent);
  }

  /**
   * Tạo reset password token
   */
  public generateResetToken(): string {
    return jwt.sign({}, config.JWT_SECRET, { expiresIn: "1h" });
  }
}

// Export singleton instance
export default new AuthService();
