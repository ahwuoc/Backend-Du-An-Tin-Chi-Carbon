import { FormRules } from "../fsm/base-fsm";
import { ILoginForm } from "../types/validation";
import { VALIDATION_CONDITIONS } from "../utils/validation";
import { VALIDATION_MESSAGES } from "../types/validation";

export const LoginForm: FormRules<ILoginForm> = {
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
      condition: VALIDATION_CONDITIONS.emailExists,
      error: VALIDATION_MESSAGES.EMAIL.NOT_EXISTS,
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
