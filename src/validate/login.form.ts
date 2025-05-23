import { FormRules } from "../fsm/base-fsm"; // Đảm bảo ConditionFn là `unknown | Promise<unknown>`
import { UserModel } from "../models/users.model";
import type IUser from "../types/user";
import bcrypt from "bcrypt";

type ILoginForm = Pick<IUser, "email" | "password">;

export const LoginForm: FormRules<ILoginForm> = {
  email: [
    {
      condition: (data) => !data.email,
      error: "Vui lòng điền email",
    },
    {
      condition: async (data) => {
        const user = await UserModel.findOne({ email: data.email });
        return user;
      },
      error: "Email không tồn tại trên hệ thống",
    },
  ],
  password: [
    {
      condition: (data) => !data.password,
      error: "Vui lòng nhập mật khẩu",
    },
    {
      condition: (data) => !(data.password.length >= 8),
      error: "Mật khẩu phải có ít nhất 8 ký tự",
    },
  ],
};
