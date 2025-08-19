import { FormRules } from "../fsm/base-fsm";
import { IRegisterForm } from "../types/validation";
import { VALIDATION_CONDITIONS } from "../utils/validation";
import { VALIDATION_MESSAGES } from "../types/validation";

export const RegisterForm: FormRules<IRegisterForm> = {
  name: [
    {
      condition: VALIDATION_CONDITIONS.nameRequired,
      error: VALIDATION_MESSAGES.REQUIRED.NAME,
    },
  ],
  email: [
    {
      condition: VALIDATION_CONDITIONS.emailRequired,
      error: VALIDATION_MESSAGES.REQUIRED.EMAIL,
    },
    {
      condition: VALIDATION_CONDITIONS.emailValid,
      error: VALIDATION_MESSAGES.EMAIL.INVALID,
    },
    {
      condition: VALIDATION_CONDITIONS.emailNotExists,
      error: VALIDATION_MESSAGES.EMAIL.EXISTS,
    },
  ],
  password: [
    {
      condition: VALIDATION_CONDITIONS.passwordRequired,
      error: VALIDATION_MESSAGES.REQUIRED.PASSWORD,
    },
    {
      condition: VALIDATION_CONDITIONS.passwordMinLength,
      error: VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH,
    },
  ],
};
