import {
  IsString,
  IsBoolean,
  IsOptional,
  IsMongoId,
  IsIn,
  IsObject,
} from "class-validator";

/**
 * Create Affiliate Payment Method DTO
 */
export class CreateAffiliatePaymentMethodDTO {
  @IsMongoId({ message: "User ID không hợp lệ" })
  userId: string;

  @IsString({ message: "Type phải là string" })
  @IsIn(["bank", "momo", "zalopay", "paypal"], {
    message: "Type phải là bank, momo, zalopay hoặc paypal",
  })
  type: "bank" | "momo" | "zalopay" | "paypal";

  @IsOptional()
  @IsString()
  name?: string;

  @IsObject({ message: "Details phải là object" })
  details: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

/**
 * Update Affiliate Payment Method DTO
 */
export class UpdateAffiliatePaymentMethodDTO {
  @IsOptional()
  @IsString()
  @IsIn(["bank", "momo", "zalopay", "paypal"], {
    message: "Type phải là bank, momo, zalopay hoặc paypal",
  })
  type?: "bank" | "momo" | "zalopay" | "paypal";

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
