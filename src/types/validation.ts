import IUser from "./user";
import { IDonation } from "./donation";

// Login form types
export interface ILoginForm {
  email: string;
  password: string;
}

// Register form types
export interface IRegisterForm {
  name: string;
  email: string;
  password: string;
}

// Donation form types
export interface IDonationForm {
  name: string;
  email: string;
  quantity: number;
  phone?: string;
  note?: string;
}

// Product form types
export interface IProductForm {
  name: string;
  type: string;
  description: string;
  status: string;
  price?: number;
}

// News form types
export interface INewsForm {
  title: string;
  content: string;
  userId: string;
  category: string;
}

// Order form types
export interface IOrderForm {
  email: string;
  buyerName: string;
  buyerPhone: string;
  amount: number;
  productId: string;
  userId: string;
  buyerAddress: string;
  note?: string;
}

// Common validation error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: {
    NAME: "Vui lòng nhập tên",
    EMAIL: "Vui lòng nhập email",
    PASSWORD: "Vui lòng nhập mật khẩu",
    PHONE: "Vui lòng nhập số điện thoại",
    ADDRESS: "Vui lòng nhập địa chỉ",
    QUANTITY: "Vui lòng nhập số lượng",
    TITLE: "Vui lòng nhập tiêu đề",
    CONTENT: "Vui lòng nhập nội dung",
    CATEGORY: "Vui lòng chọn danh mục",
    TYPE: "Vui lòng chọn loại",
    STATUS: "Vui lòng chọn trạng thái",
    DESCRIPTION: "Vui lòng nhập mô tả",
  },
  EMAIL: {
    INVALID: "Email không đúng định dạng",
    EXISTS: "Email đã tồn tại trên hệ thống",
    NOT_EXISTS: "Email không tồn tại trên hệ thống",
  },
  PASSWORD: {
    MIN_LENGTH: "Mật khẩu phải có ít nhất 8 ký tự",
    WEAK: "Mật khẩu quá yếu",
  },
  NUMBER: {
    MIN: "Giá trị phải lớn hơn 0",
    POSITIVE: "Giá trị phải là số dương",
  },
  PHONE: {
    INVALID: "Số điện thoại không đúng định dạng",
  },
} as const;
