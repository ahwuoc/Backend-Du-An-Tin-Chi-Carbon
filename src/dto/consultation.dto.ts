import {
  IsString,
  IsEmail,
  IsOptional,
  IsMongoId,
  IsIn,
  IsNumber,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

/**
 * Create Consultation DTO
 */
export class CreateConsultationDTO {
  @IsMongoId({ message: "User ID không hợp lệ" })
  userId: string;

  @IsString({ message: "Tên phải là string" })
  @MinLength(2, { message: "Tên phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString({ message: "Số điện thoại phải là string" })
  phone: string;

  @IsEmail({}, { message: "Email không hợp lệ" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString({ message: "Loại tư vấn phải là string" })
  @IsIn(["forest", "agriculture", "biochar", "csu", "carbonbook", "other"], {
    message: "Loại tư vấn không hợp lệ",
  })
  consultationType: "forest" | "agriculture" | "biochar" | "csu" | "carbonbook" | "other";

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @IsString()
  projectSize?: string;

  @IsOptional()
  @IsString()
  projectLocation?: string;

  @IsOptional()
  @IsString()
  implementationTimeline?: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  carbonGoals?: string;
}

/**
 * Delete Consultation DTO (with feedback)
 */
export class DeleteConsultationDTO {
  @IsString({ message: "Tên phải là string" })
  name: string;

  @IsEmail({}, { message: "Email không hợp lệ" })
  email: string;

  @IsString({ message: "Feedback phải là string" })
  feedback: string;
}
