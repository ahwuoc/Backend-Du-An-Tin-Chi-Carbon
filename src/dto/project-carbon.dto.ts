import {
  IsString,
  IsEmail,
  IsOptional,
  IsMongoId,
  IsIn,
  IsArray,
  IsObject,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

/**
 * Create Project Carbon DTO
 */
export class CreateProjectCarbonDTO {
  @IsString({ message: "Tên phải là string" })
  @MinLength(2, { message: "Tên phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsString({ message: "Số điện thoại phải là string" })
  phone: string;

  @IsEmail({}, { message: "Email không hợp lệ" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString({ message: "Loại dự án phải là string" })
  @IsIn(["forest", "rice", "biochar"], {
    message: "Loại dự án phải là forest, rice hoặc biochar",
  })
  projectType: "forest" | "rice" | "biochar";

  @IsOptional()
  @IsObject()
  details?: {
    forestLocation?: string;
    forestArea?: string;
    treeSpecies?: string;
    plantingAge?: string;
    averageHeight?: string;
    averageCircumference?: string;
    previousDeforestation?: "no" | "yes" | "unknown" | "";
    riceLocation?: string;
    riceArea?: string;
    riceTerrain?: string;
    riceClimate?: string;
    riceSoilType?: string;
    riceStartDate?: string | Date | null;
    riceEndDate?: string | Date | null;
    biocharRawMaterial?: string;
    biocharCarbonContent?: string;
    biocharLandArea?: string;
    biocharApplicationMethod?: string;
  };

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @IsOptional()
  @IsArray()
  landDocuments?: string[];

  @IsOptional()
  @IsString()
  kmlFile?: string | null;

  @IsMongoId({ message: "User ID không hợp lệ" })
  userId: string;
}

/**
 * Update Project Carbon DTO
 */
export class UpdateProjectCarbonDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Tên phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: "Email không hợp lệ" })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @IsIn(["forest", "rice", "biochar"], {
    message: "Loại dự án phải là forest, rice hoặc biochar",
  })
  projectType?: "forest" | "rice" | "biochar";

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @IsOptional()
  @IsArray()
  landDocuments?: string[];

  @IsOptional()
  @IsString()
  kmlFile?: string | null;
}
