import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  Min,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

/**
 * Create Donation DTO
 */
export class CreateDonationDTO {
  @IsString({ message: "Tên phải là string" })
  @MinLength(2, { message: "Tên phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail({}, { message: "Email không hợp lệ" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString({ message: "Số điện thoại phải là string" })
  phone: string;

  @IsNumber({}, { message: "Số lượng phải là số" })
  @Min(1, { message: "Số lượng phải >= 1" })
  quantity: number;

  @IsOptional()
  @IsString()
  note?: string;
}

/**
 * Update Donation DTO
 */
export class UpdateDonationDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Tên phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Email không hợp lệ" })
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber({}, { message: "Số lượng phải là số" })
  @Min(1, { message: "Số lượng phải >= 1" })
  quantity?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
