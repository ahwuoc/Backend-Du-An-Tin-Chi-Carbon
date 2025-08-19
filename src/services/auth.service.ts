import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { sendEmail } from "../utils/email/sendEmail";
import { resetPasswordContent } from "../utils/email/emailTemplates";
import { UserModel } from "../models/users.model";
import { Product } from "../models/products.model";
import { ProjectMember } from "../models/project-member.router";
import { Project } from "../models/project.model";
import Order from "../models/order.model";
import AffiliateModel from "../models/affiliate.model";
import { ProjectCarbon } from "../models/project-carbon.model";
import { RegisterForm, LoginForm } from "../validate";
import { validateFlow } from "../fsm/base-fsm";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is missing.");
  process.exit(1);
}

export interface IUser {
  id: string;
  email: string;
  role: string;
}

import type { FieldError } from "../fsm/base-fsm";

export interface IAuthService {
  createToken(payload: object, expiresIn?: string): string;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  validateUserExistence(email: string): Promise<boolean>;
  createUser(userData: any): Promise<any>;
  findUserById(id: string): Promise<any>;
  findUserByEmail(email: string): Promise<any>;
  updateUser(id: string, updateData: any): Promise<any>;
  deleteUser(id: string): Promise<any>;
  getAllUsers(): Promise<any[]>;
  getManagerInfo(userId: string): Promise<{ orders: any[]; projects: any[] }>;
  verifyToken(token: string): IUser;
  validateRegistration(data: any): Promise<FieldError[]>;
  validateLogin(data: any): Promise<FieldError[]>;
  sendResetPasswordEmail(email: string, resetToken: string): Promise<void>;
  generateResetToken(): string;
}

export class AuthService implements IAuthService {
  private userModel = UserModel;

  public createToken(
    payload: object,
    expiresIn: string = JWT_EXPIRES_IN,
  ): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public async validateUserExistence(email: string): Promise<boolean> {
    const existingUser = await this.userModel.findOne({ email });
    return !!existingUser;
  }

  public async createUser(userData: any): Promise<any> {
    return await this.userModel.create(userData);
  }

  public async findUserById(id: string): Promise<any> {
    return await this.userModel.findById(id).select("-password");
  }

  public async findUserByEmail(email: string): Promise<any> {
    return await this.userModel.findOne({ email }).select("+password");
  }

  public async updateUser(id: string, updateData: any): Promise<any> {
    return await this.userModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .select("-password");
  }

  public async deleteUser(id: string): Promise<any> {
    return await this.userModel.findByIdAndDelete(id);
  }

  public async getAllUsers(): Promise<any[]> {
    return await this.userModel.find().select("-password").lean();
  }

  public async getManagerInfo(userId: string): Promise<{
    orders: any[];
    projects: any[];
  }> {
    const orders = await Order.find({ userId }).populate("productId");
    const projects = await ProjectCarbon.find({ userId });
    return { orders, projects };
  }

  public verifyToken(token: string): IUser {
    const decoded = jwt.verify(token, JWT_SECRET) as IUser;
    return decoded;
  }

  public async validateRegistration(data: any): Promise<FieldError[]> {
    return await validateFlow(data, RegisterForm);
  }

  public async validateLogin(data: any): Promise<FieldError[]> {
    return await validateFlow(data, LoginForm);
  }

  public async sendResetPasswordEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailContent = resetPasswordContent(resetUrl);
    await sendEmail(email, "Reset Password", emailContent);
  }

  public generateResetToken(): string {
    return jwt.sign({}, JWT_SECRET, { expiresIn: "1h" });
  }

  public async handleUserExistenceAndPasswordHashing(
    email: string,
    password: string,
  ): Promise<string> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error("Người dùng đã tồn tại với email này.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}

export default new AuthService();
