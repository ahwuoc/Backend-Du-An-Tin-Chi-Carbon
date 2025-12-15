import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  Min,
  IsArray,
  MaxLength,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

/**
 * Create Product DTO
 */
export class CreateProductDTO {
  @IsString({ message: "Tên sản phẩm phải là string" })
  @MinLength(2, { message: "Tên sản phẩm phải có ít nhất 2 ký tự" })
  @MaxLength(200, { message: "Tên sản phẩm không được vượt quá 200 ký tự" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({}, { message: "Giá phải là số" })
  @Min(0, { message: "Giá phải >= 0" })
  price: number;

  @IsOptional()
  @IsString()
  @IsIn(["active", "inactive", "draft"], {
    message: "Status phải là active, inactive hoặc draft",
  })
  status?: "active" | "inactive" | "draft";

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  features?: any[];

  @IsOptional()
  @IsArray()
  benefits?: any[];

  @IsOptional()
  @IsArray()
  timeline?: any[];

  @IsOptional()
  @IsArray()
  reports?: any[];

  @IsOptional()
  @IsArray()
  certificates?: any[];
}

/**
 * Update Product DTO
 */
export class UpdateProductDTO {
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
  @IsString()
  @IsIn(["active", "inactive", "draft"], {
    message: "Status phải là active, inactive hoặc draft",
  })
  status?: "active" | "inactive" | "draft";

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  features?: any[];

  @IsOptional()
  @IsArray()
  benefits?: any[];

  @IsOptional()
  @IsArray()
  timeline?: any[];

  @IsOptional()
  @IsArray()
  reports?: any[];

  @IsOptional()
  @IsArray()
  certificates?: any[];
}

/**
 * Query Products DTO
 */
export class QueryProductsDTO {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  priceMin?: string;

  @IsOptional()
  @IsString()
  priceMax?: string;
}
