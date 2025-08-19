import { FormRules } from "../fsm/base-fsm";
import { IOrderForm } from "../types/validation";
import { VALIDATION_CONDITIONS } from "../utils/validation";
import { VALIDATION_MESSAGES } from "../types/validation";

export const OrderForm: FormRules<IOrderForm> = {
  email: [
    {
      condition: VALIDATION_CONDITIONS.emailRequired,
      error: VALIDATION_MESSAGES.REQUIRED.EMAIL,
    },
    {
      condition: VALIDATION_CONDITIONS.emailValid,
      error: VALIDATION_MESSAGES.EMAIL.INVALID,
    },
  ],
  buyerName: [
    {
      condition: VALIDATION_CONDITIONS.nameRequired,
      error: VALIDATION_MESSAGES.REQUIRED.NAME,
    },
  ],
  buyerPhone: [
    {
      condition: (data) => !data.buyerPhone,
      error: VALIDATION_MESSAGES.REQUIRED.PHONE,
    },
    {
      condition: VALIDATION_CONDITIONS.phoneValid,
      error: VALIDATION_MESSAGES.PHONE.INVALID,
    },
  ],
  amount: [
    {
      condition: VALIDATION_CONDITIONS.amountRequired,
      error: "Vui lòng nhập số tiền",
    },
    {
      condition: VALIDATION_CONDITIONS.amountPositive,
      error: VALIDATION_MESSAGES.NUMBER.POSITIVE,
    },
  ],
  productId: [
    {
      condition: (data) => !data.productId,
      error: "Vui lòng chọn sản phẩm",
    },
  ],
  userId: [
    {
      condition: (data) => !data.userId,
      error: "Vui lòng chọn người dùng",
    },
  ],
  buyerAddress: [
    {
      condition: VALIDATION_CONDITIONS.addressRequired,
      error: VALIDATION_MESSAGES.REQUIRED.ADDRESS,
    },
  ],
};
