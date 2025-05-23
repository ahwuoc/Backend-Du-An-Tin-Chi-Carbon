import { FormRules } from "../fsm/base-fsm";
import { UserModel } from "../models/users.model";
import type IUser from "../types/user";

type IRegisterForm = Pick<IUser, "name" | "email" | "password">;

export const RegisterForm: FormRules<IRegisterForm> = {
  name: [
    {
      condition: (data) => !data.name,
      error: "Vui lòng nhập tên",
    },
  ],
  email: [
    {
      condition: (data) => !data.email,
      error: "Vui lòng nhập email",
    },
    {
      condition: async (data) => {
        const user = await UserModel.findOne({ email: data.email });
        return user;
      },
      error: "Email đã tồn tại trên hệ thống",
    },
  ],
  password: [
    {
      condition: (data) => !data.password,
      error: "Vui lòng nhập password",
    },
    {
      condition: (data) => data.password.length < 8,
      error: "Vui lòng điền password lớn hơn 8 ký tự",
    },
  ],
};
