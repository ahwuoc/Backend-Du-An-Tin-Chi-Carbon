import {
  IsString,
  IsOptional,
  IsIn,
  IsArray,
  MaxLength,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

/**
 * Create News DTO
 */
export class CreateNewsDTO {
  @IsString({ message: "Tiêu đề phải là string" })
  @MinLength(5, { message: "Tiêu đề phải có ít nhất 5 ký tự" })
  @MaxLength(300, { message: "Tiêu đề không được vượt quá 300 ký tự" })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsString({ message: "Nội dung phải là string" })
  @MinLength(10, { message: "Nội dung phải có ít nhất 10 ký tự" })
  content: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  @IsIn(["draft", "published", "archived"], {
    message: "Status phải là draft, published hoặc archived",
  })
  status?: "draft" | "published" | "archived";

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  author?: string;
}

/**
 * Update News DTO
 */
export class UpdateNewsDTO {
  @IsOptional()
  @IsString()
  @MinLength(5, { message: "Tiêu đề phải có ít nhất 5 ký tự" })
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: "Nội dung phải có ít nhất 10 ký tự" })
  content?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  @IsIn(["draft", "published", "archived"], {
    message: "Status phải là draft, published hoặc archived",
  })
  status?: "draft" | "published" | "archived";

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
