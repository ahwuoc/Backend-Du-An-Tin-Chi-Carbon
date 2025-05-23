import { error } from "winston";
import { FormRules } from "../fsm/base-fsm";
import { UserModel } from "../models/users.model";
import type IDonation from "../types/donation";
type IDonationForm = Pick<IDonation, "email" | "quantity" | "name">;
export const DonationForm: FormRules<IDonationForm> = {
  name: [
    {
      condition: (data) => !data.name,
      error: "Vui lòng điền tên",
    },
  ],
  email: [
    {
      condition: (data) => !data.email,
      error: "Vui lòng điền email",
    },
  ],
  quantity: [
    {
      condition: (data) => !data.quantity,
      error: "Vui lòng nhập số lượng",
    },
  ],
};
