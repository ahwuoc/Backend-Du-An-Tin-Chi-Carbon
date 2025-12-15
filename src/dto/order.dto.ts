import {
  IsString,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsIn,
  IsEmail,
  Min,
  IsArray,
} from "class-validator";
import { Transform } from "class-transformer";

/**
 * Create Order DTO
 */
export class CreateOrderDTO {
  @IsMongoId({ message: "User ID không hợp lệ" })
  userId: string;

  @IsMongoId({ message: "Product ID không hợp lệ" })
  productId: string;

  @IsString({ message: "Tên phải là string" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail({}, { message: "Email không hợp lệ" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString({ message: "Số điện thoại phải là string" })
  phone: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber({}, { message: "Quantity phải là số" })
  @Min(1, { message: "Quantity phải >= 1" })
  quantity: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  @IsIn(["cod", "bank", "momo", "zalopay"], {
    message: "Payment method không hợp lệ",
  })
  paymentMethod?: string;
}

/**
 * Update Order Status DTO
 */
export class UpdateOrderStatusDTO {
  @IsString({ message: "Status phải là string" })
  @IsIn(["pending", "processing", "shipped", "delivered", "cancelled"], {
    message: "Status không hợp lệ",
  })
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}
