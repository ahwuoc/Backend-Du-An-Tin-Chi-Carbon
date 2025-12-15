import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  Min,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

/**
 * Create Carbon Credit DTO
 */
export class CreateCarbonCreditDTO {
  @IsString({ message: "Tên phải là string" })
  @MinLength(2, { message: "Tên phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({}, { message: "Số lượng phải là số" })
  @Min(0, { message: "Số lượng phải >= 0" })
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  @IsIn(["available", "sold", "reserved"], {
    message: "Status phải là available, sold hoặc reserved",
  })
  status?: "available" | "sold" | "reserved";

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  certificateId?: string;
}

/**
 * Update Carbon Credit DTO
 */
export class UpdateCarbonCreditDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Tên phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: "Số lượng phải là số" })
  @Min(0, { message: "Số lượng phải >= 0" })
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  @IsIn(["available", "sold", "reserved"], {
    message: "Status phải là available, sold hoặc reserved",
  })
  status?: "available" | "sold" | "reserved";
}
