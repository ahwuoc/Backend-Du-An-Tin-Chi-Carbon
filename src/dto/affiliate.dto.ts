import {
  IsString,
  IsEmail,
  IsOptional,
  IsMongoId,
  IsIn,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

/**
 * Create Affiliate DTO
 */
export class CreateAffiliateDTO {
  @IsMongoId({ message: "User ID không hợp lệ" })
  userId: string;

  @IsString({ message: "Họ tên phải là string" })
  @MinLength(2, { message: "Họ tên phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  fullName: string;

  @IsEmail({}, { message: "Email không hợp lệ" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString({ message: "Số điện thoại phải là string" })
  phone: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  socialMedia?: string;

  @IsOptional()
  @IsString()
  experience?: string;
}

/**
 * Update Affiliate Status DTO
 */
export class UpdateAffiliateStatusDTO {
  @IsString({ message: "Status phải là string" })
  @IsIn(["pending", "approved", "rejected"], {
    message: "Status phải là pending, approved hoặc rejected",
  })
  status: "pending" | "approved" | "rejected";
}
