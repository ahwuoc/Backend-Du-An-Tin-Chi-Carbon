import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  Min,
  MinLength,
} from "class-validator";
import { Transform, Type } from "class-transformer";

/**
 * Create Certificate DTO
 */
export class CreateCertificateDTO {
  @IsString({ message: "Tên chứng chỉ phải là string" })
  @MinLength(2, { message: "Tên chứng chỉ phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: "Ngày cấp không hợp lệ" })
  issueDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: "Ngày hết hạn không hợp lệ" })
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  certificateNumber?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbonCredits?: number;
}

/**
 * Update Certificate DTO
 */
export class UpdateCertificateDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Tên chứng chỉ phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: "Ngày cấp không hợp lệ" })
  issueDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: "Ngày hết hạn không hợp lệ" })
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  certificateNumber?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbonCredits?: number;
}
