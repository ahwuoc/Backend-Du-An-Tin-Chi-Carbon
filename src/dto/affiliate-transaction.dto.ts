import {
  IsString,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsIn,
  Min,
} from "class-validator";

/**
 * Create Affiliate Transaction DTO
 */
export class CreateAffiliateTransactionDTO {
  @IsMongoId({ message: "Affiliate ID không hợp lệ" })
  affiliateId: string;

  @IsNumber({}, { message: "Amount phải là số" })
  @Min(0, { message: "Amount phải >= 0" })
  amount: number;

  @IsString({ message: "Type phải là string" })
  @IsIn(["commission", "payout", "bonus"], {
    message: "Type phải là commission, payout hoặc bonus",
  })
  type: "commission" | "payout" | "bonus";

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(["pending", "completed", "failed"], {
    message: "Status phải là pending, completed hoặc failed",
  })
  status?: "pending" | "completed" | "failed";
}

/**
 * Update Affiliate Transaction DTO
 */
export class UpdateAffiliateTransactionDTO {
  @IsOptional()
  @IsNumber({}, { message: "Amount phải là số" })
  @Min(0, { message: "Amount phải >= 0" })
  amount?: number;

  @IsOptional()
  @IsString()
  @IsIn(["pending", "completed", "failed"], {
    message: "Status phải là pending, completed hoặc failed",
  })
  status?: "pending" | "completed" | "failed";

  @IsOptional()
  @IsString()
  description?: string;
}
