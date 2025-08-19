import { FormRules, ValidationHelpers } from "../fsm/base-fsm";
import { IDonationForm } from "../types/validation";
import { VALIDATION_MESSAGES } from "../types/validation";

export const DonationForm: FormRules<IDonationForm> = {
  name: [
    {
      condition: ValidationHelpers.required<IDonationForm>('name'),
      error: VALIDATION_MESSAGES.REQUIRED.NAME,
      required: true,
      stopOnError: true
    },
    {
      condition: ValidationHelpers.minLength<IDonationForm>('name', 2),
      error: "Tên phải có ít nhất 2 ký tự"
    }
  ],
  email: [
    {
      condition: ValidationHelpers.required<IDonationForm>('email'),
      error: VALIDATION_MESSAGES.REQUIRED.EMAIL,
      required: true,
      stopOnError: true
    },
    {
      condition: ValidationHelpers.email<IDonationForm>('email'),
      error: VALIDATION_MESSAGES.EMAIL.INVALID
    }
  ],
  quantity: [
    {
      condition: ValidationHelpers.required<IDonationForm>('quantity'),
      error: VALIDATION_MESSAGES.REQUIRED.QUANTITY,
      required: true,
      stopOnError: true
    },
    {
      condition: ValidationHelpers.numberRange<IDonationForm>('quantity', 1, 1000),
      error: "Số lượng cây phải từ 1 đến 1000"
    }
  ],
  phone: [
    {
      condition: (data: IDonationForm) => {
        if (!data.phone) return true; // Optional field
        const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
        return phoneRegex.test(data.phone);
      },
      error: VALIDATION_MESSAGES.PHONE.INVALID
    }
  ],
  note: [
    {
      condition: (data: IDonationForm) => {
        if (!data.note) return true; // Optional field
        return data.note.length <= 500; // Max 500 characters
      },
      error: "Ghi chú không được quá 500 ký tự"
    }
  ]
};
