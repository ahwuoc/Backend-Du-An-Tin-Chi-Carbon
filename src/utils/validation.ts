import { UserModel } from "../models/users.model";
import { VALIDATION_MESSAGES } from "../types/validation";

/**
 * Kiểm tra email có đúng định dạng không
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra email có tồn tại trong database không
 */
export const isEmailExists = async (email: string): Promise<boolean> => {
  const user = await UserModel.findOne({ email });
  return !!user;
};

/**
 * Kiểm tra email không tồn tại trong database (cho register)
 */
export const isEmailNotExists = async (email: string): Promise<boolean> => {
  const user = await UserModel.findOne({ email });
  return !user;
};

/**
 * Kiểm tra mật khẩu có đủ mạnh không
 */
export const isStrongPassword = (password: string): boolean => {
  // Ít nhất 8 ký tự, có chữ hoa, chữ thường, số
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Kiểm tra số điện thoại có đúng định dạng không
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Kiểm tra số có dương không
 */
export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

/**
 * Kiểm tra chuỗi có rỗng không
 */
export const isEmpty = (value: string): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * Validation conditions cho các form
 */
export const VALIDATION_CONDITIONS = {
  // Email validations
  emailRequired: (data: any) => isEmpty(data.email),
  emailValid: (data: any) => !isEmpty(data.email) && !isValidEmail(data.email),
  emailExists: async (data: any) => await isEmailExists(data.email),
  emailNotExists: async (data: any) => await isEmailNotExists(data.email),
  
  // Password validations
  passwordRequired: (data: any) => isEmpty(data.password),
  passwordMinLength: (data: any) => !isEmpty(data.password) && data.password.length < 8,
  passwordStrong: (data: any) => !isEmpty(data.password) && !isStrongPassword(data.password),
  
  // Name validations
  nameRequired: (data: any) => isEmpty(data.name),
  
  // Phone validations
  phoneValid: (data: any) => !isEmpty(data.phone) && !isValidPhone(data.phone),
  
  // Number validations
  quantityRequired: (data: any) => !data.quantity,
  quantityPositive: (data: any) => data.quantity && !isPositiveNumber(data.quantity),
  
  // Other validations
  titleRequired: (data: any) => isEmpty(data.title),
  contentRequired: (data: any) => isEmpty(data.content),
  categoryRequired: (data: any) => isEmpty(data.category),
  typeRequired: (data: any) => isEmpty(data.type),
  statusRequired: (data: any) => isEmpty(data.status),
  descriptionRequired: (data: any) => isEmpty(data.description),
  addressRequired: (data: any) => isEmpty(data.buyerAddress),
  amountRequired: (data: any) => !data.amount,
  amountPositive: (data: any) => data.amount && !isPositiveNumber(data.amount),
} as const;
