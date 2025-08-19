import { FormRules } from "../fsm/base-fsm";
import { IProductForm } from "../types/validation";
import { VALIDATION_CONDITIONS } from "../utils/validation";
import { VALIDATION_MESSAGES } from "../types/validation";

export const ProductForm: FormRules<IProductForm> = {
  name: [
    {
      condition: VALIDATION_CONDITIONS.nameRequired,
      error: VALIDATION_MESSAGES.REQUIRED.NAME,
    },
  ],
  type: [
    {
      condition: VALIDATION_CONDITIONS.typeRequired,
      error: VALIDATION_MESSAGES.REQUIRED.TYPE,
    },
  ],
  description: [
    {
      condition: VALIDATION_CONDITIONS.descriptionRequired,
      error: VALIDATION_MESSAGES.REQUIRED.DESCRIPTION,
    },
  ],
  status: [
    {
      condition: VALIDATION_CONDITIONS.statusRequired,
      error: VALIDATION_MESSAGES.REQUIRED.STATUS,
    },
  ],
  price: [
    {
      condition: (data) => data.price !== undefined && !VALIDATION_CONDITIONS.amountPositive(data),
      error: VALIDATION_MESSAGES.NUMBER.POSITIVE,
    },
  ],
};
