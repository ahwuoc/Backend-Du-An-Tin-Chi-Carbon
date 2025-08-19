export type FieldName = string;

export type ConditionFn<T> = (formData: T) => boolean | Promise<boolean>;

export interface FieldRule<T> {
  condition?: ConditionFn<T>;
  error: string;
  required?: boolean; // Field bắt buộc
  stopOnError?: boolean; // Dừng validation khi gặp lỗi này
}

export type FieldError = {
  field: string;
  message: string;
  code?: string; // Error code để frontend xử lý
};

export type FormRules<T> = {
  [K in keyof T]: FieldRule<T>[];
};

export type ValidationOptions = {
  stopOnFirstError?: boolean; // Dừng khi gặp lỗi đầu tiên
  timeout?: number; // Timeout cho async operations (ms)
  validateRequiredFirst?: boolean; // Validate required fields trước
};

export async function validateFlow<T>(
  data: T,
  rules: FormRules<T>,
  options: ValidationOptions = {}
): Promise<FieldError[]> {
  const {
    stopOnFirstError = false,
    timeout = 5000,
    validateRequiredFirst = true
  } = options;
  
  const errors: FieldError[] = [];
  
  try {
    // Validate required fields first if option is enabled
    if (validateRequiredFirst) {
      for (const key of Object.keys(rules) as (keyof T)[]) {
        const fieldRules = rules[key];
        const requiredRule = fieldRules.find(rule => rule.required);
        
        if (requiredRule) {
          const fieldValue = data[key];
          const isEmpty = !fieldValue || 
            (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
            (Array.isArray(fieldValue) && fieldValue.length === 0);
          
          if (isEmpty) {
            errors.push({
              field: key as string,
              message: requiredRule.error,
              code: 'REQUIRED'
            });
            
            if (stopOnFirstError) return errors;
          }
        }
      }
    }
    
    // Validate all other rules
    for (const key of Object.keys(rules) as (keyof T)[]) {
      const fieldRules = rules[key];
      
      for (const rule of fieldRules) {
        // Skip required validation if already done
        if (validateRequiredFirst && rule.required) continue;
        
        try {
          let isValid = true;
          
          if (rule.condition) {
            // Handle async conditions with timeout
            const conditionPromise = Promise.resolve(rule.condition(data));
            const timeoutPromise = new Promise<boolean>((_, reject) => {
              setTimeout(() => reject(new Error('Validation timeout')), timeout);
            });
            
            isValid = await Promise.race([conditionPromise, timeoutPromise]);
          }
          
          // Logic đã được đảo ngược: true = hợp lệ, false = có lỗi
          if (!isValid) {
            errors.push({
              field: String(key),
              message: rule.error,
              code: rule.stopOnError ? 'CRITICAL' : 'VALIDATION'
            });
            
            if (rule.stopOnError || stopOnFirstError) {
              return errors;
            }
            break; // Dừng validation cho field này
          }
        } catch (error) {
          console.error(`Validation error for field ${String(key)}:`, error);
          errors.push({
            field: String(key),
            message: 'Lỗi validation không xác định',
            code: 'SYSTEM_ERROR'
          });
          
          if (stopOnFirstError) return errors;
        }
      }
    }
  } catch (error) {
    console.error('Validation flow error:', error);
    errors.push({
      field: 'system',
      message: 'Lỗi hệ thống validation',
      code: 'SYSTEM_ERROR'
    });
  }
  
  return errors;
}

// Helper functions for common validations
export const ValidationHelpers = {
  // Required field validation
  required: <T>(field: keyof T) => (data: T): boolean => {
    const value = data[field];
    return !!(value && 
      (typeof value !== 'string' || value.trim() !== '') &&
      (!Array.isArray(value) || value.length > 0));
  },
  
  // Email validation
  email: <T>(field: keyof T) => (data: T): boolean => {
    const value = data[field] as string;
    if (!value) return true; // Skip if empty (use required for mandatory)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  // Min length validation
  minLength: <T>(field: keyof T, min: number) => (data: T): boolean => {
    const value = data[field] as string;
    if (!value) return true;
    return value.length >= min;
  },
  
  // Number range validation
  numberRange: <T>(field: keyof T, min?: number, max?: number) => (data: T): boolean => {
    const value = data[field] as number;
    if (value === undefined || value === null) return true;
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  },
  
  // Cross-field validation
  crossField: <T>(field1: keyof T, field2: keyof T, validator: (val1: any, val2: any) => boolean) => 
    (data: T): boolean => {
      return validator(data[field1], data[field2]);
    }
};
