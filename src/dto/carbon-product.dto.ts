import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  Min,
  MinLength,
  IsArray,
} from "class-validator";
import { Transform } from "class-transformer";

/**
 * Create Carbon Product DTO
 */
export class CreateCarbonProductDTO {
  @IsString({ message: "Tên sản phẩm phải là string" })
  @MinLength(2, { message: "Tên sản phẩm phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: "Giá phải là số" })
  @Min(0, { message: "Giá phải >= 0" })
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  @IsIn(["active", "inactive", "sold_out"], {
    message: "Status phải là active, inactive hoặc sold_out",
  })
  status?: "active" | "inactive" | "sold_out";

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  images?: string[];
}

/**
 * Update Carbon Product DTO
 */
export class UpdateCarbonProductDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Tên sản phẩm phải có ít nhất 2 ký tự" })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: "Giá phải là số" })
  @Min(0, { message: "Giá phải >= 0" })
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  @IsIn(["active", "inactive", "sold_out"], {
    message: "Status phải là active, inactive hoặc sold_out",
  })
  status?: "active" | "inactive" | "sold_out";

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  images?: string[];
}
