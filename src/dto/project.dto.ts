import {
  IsString,
  IsOptional,
  IsMongoId,
  IsIn,
  IsArray,
  IsNumber,
  IsDate,
  MinLength,
} from "class-validator";
import { Transform, Type } from "class-transformer";

/**
 * Create Project DTO
 */
export class CreateProjectDTO {
  @IsString({ message: "Tên dự án phải là string" })
  @MinLength(2, { message: "Tên dự án phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(["pending", "active", "completed", "cancelled"], {
    message: "Status không hợp lệ",
  })
  status?: "pending" | "active" | "completed" | "cancelled";

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  registrationDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  carbonCredits?: number;

  @IsOptional()
  @IsNumber()
  carbonCreditsTotal?: number;

  @IsOptional()
  @IsNumber()
  carbonCreditsClaimed?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  coordinates?: any;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsArray()
  participants?: any[];

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsArray()
  documents?: any[];

  @IsOptional()
  @IsArray()
  activities?: any[];

  @IsOptional()
  @IsMongoId()
  userId?: string;
}

/**
 * Update Project DTO
 */
export class UpdateProjectDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Tên dự án phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(["pending", "active", "completed", "cancelled"], {
    message: "Status không hợp lệ",
  })
  status?: "pending" | "active" | "completed" | "cancelled";

  @IsOptional()
  @IsNumber()
  carbonCredits?: number;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsArray()
  documents?: any[];

  @IsOptional()
  @IsArray()
  activities?: any[];
}

/**
 * Update Document Status DTO
 */
export class UpdateDocumentStatusDTO {
  @IsString({ message: "Status phải là string" })
  @IsIn(["pending", "approved", "rejected"], {
    message: "Status phải là pending, approved hoặc rejected",
  })
  status: "pending" | "approved" | "rejected";
}
