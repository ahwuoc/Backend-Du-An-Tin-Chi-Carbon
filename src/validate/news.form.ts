import { FormRules } from "../fsm/base-fsm";
import { INewsForm } from "../types/validation";
import { VALIDATION_CONDITIONS } from "../utils/validation";
import { VALIDATION_MESSAGES } from "../types/validation";

export const NewsForm: FormRules<INewsForm> = {
  title: [
    {
      condition: VALIDATION_CONDITIONS.titleRequired,
      error: VALIDATION_MESSAGES.REQUIRED.TITLE,
    },
  ],
  content: [
    {
      condition: VALIDATION_CONDITIONS.contentRequired,
      error: VALIDATION_MESSAGES.REQUIRED.CONTENT,
    },
  ],
  userId: [
    {
      condition: (data) => !data.userId,
      error: "Vui lòng chọn người dùng",
    },
  ],
  category: [
    {
      condition: VALIDATION_CONDITIONS.categoryRequired,
      error: VALIDATION_MESSAGES.REQUIRED.CATEGORY,
    },
  ],
};
