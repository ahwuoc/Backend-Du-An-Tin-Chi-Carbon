import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from "class-validator";
import { Transform } from "class-transformer";

/**
 * Register DTO
 * Validate dữ liệu khi user register
 */
export class RegisterDTO {
  @IsEmail({}, { message: "Email không hợp lệ" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString({ message: "Mật khẩu phải là string" })
  @MinLength(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
  @MaxLength(50, { message: "Mật khẩu không được vượt quá 50 ký tự" })
  password: string;

  @IsString({ message: "Tên phải là string" })
  @MinLength(2, { message: "Tên phải có ít nhất 2 ký tự" })
  @MaxLength(100, { message: "Tên không được vượt quá 100 ký tự" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  role?: "user" | "admin" | "editor";
}

/**
 * Login DTO
 */
export class LoginDTO {
  @IsEmail({}, { message: "Email không hợp lệ" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString({ message: "Mật khẩu phải là string" })
  @MinLength(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
  password: string;
}

/**
 * Change Password DTO
 */
export class ChangePasswordDTO {
  @IsString({ message: "Mật khẩu cũ phải là string" })
  oldPassword: string;

  @IsString({ message: "Mật khẩu mới phải là string" })
  @MinLength(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" })
  @MaxLength(50, { message: "Mật khẩu mới không được vượt quá 50 ký tự" })
  newPassword: string;
}

/**
 * Forgot Password DTO
 */
export class ForgotPasswordDTO {
  @IsEmail({}, { message: "Email không hợp lệ" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;
}

/**
 * Reset Password DTO
 */
export class ResetPasswordDTO {
  @IsString({ message: "Token phải là string" })
  token: string;

  @IsString({ message: "Mật khẩu mới phải là string" })
  @MinLength(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" })
  @MaxLength(50, { message: "Mật khẩu mới không được vượt quá 50 ký tự" })
  newPassword: string;
}

/**
 * Update Profile DTO
 */
export class UpdateProfileDTO {
  @IsOptional()
  @IsString({ message: "Tên phải là string" })
  @MinLength(2, { message: "Tên phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString({ message: "Avatar phải là string" })
  avatar?: string;

  @IsOptional()
  @IsString({ message: "Số điện thoại phải là string" })
  @Matches(/^[0-9]{10,11}$/, { message: "Số điện thoại không hợp lệ" })
  phone?: string;

  @IsOptional()
  @IsString({ message: "Địa chỉ phải là string" })
  address?: string;
}
