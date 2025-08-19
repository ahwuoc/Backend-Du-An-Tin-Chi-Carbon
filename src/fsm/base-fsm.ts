export type FieldName = string;

export type ConditionFn<T> = (formData: T) => boolean | Promise<boolean>;

export interface FieldRule<T> {
  condition?: ConditionFn<T>;
  error: string;
  required?: boolean;
  stopOnError?: boolean;
}

export type FieldError = {
  field: string;
  message: string;
  code?: string;
};

export type FormRules<T> = {
  [K in keyof T]: FieldRule<T>[];
};

export type ValidationOptions = {
  stopOnFirstError?: boolean;
  timeout?: number;
  validateRequiredFirst?: boolean;
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
    
    for (const key of Object.keys(rules) as (keyof T)[]) {
      const fieldRules = rules[key];
      
      for (const rule of fieldRules) {
        if (validateRequiredFirst && rule.required) continue;
        
        try {
          let isValid = true;
          
          if (rule.condition) {
            const conditionPromise = Promise.resolve(rule.condition(data));
            const timeoutPromise = new Promise<boolean>((_, reject) => {
              setTimeout(() => reject(new Error('Validation timeout')), timeout);
            });
            
            isValid = await Promise.race([conditionPromise, timeoutPromise]);
          }
          
          if (!isValid) {
            errors.push({
              field: String(key),
              message: rule.error,
              code: rule.stopOnError ? 'CRITICAL' : 'VALIDATION'
            });
            
            if (rule.stopOnError || stopOnFirstError) {
              return errors;
            }
            break;
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

export const ValidationHelpers = {
  required: <T>(field: keyof T) => (data: T): boolean => {
    const value = data[field];
    return !!(value && 
      (typeof value !== 'string' || value.trim() !== '') &&
      (!Array.isArray(value) || value.length > 0));
  },
  
  email: <T>(field: keyof T) => (data: T): boolean => {
    const value = data[field] as string;
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  minLength: <T>(field: keyof T, min: number) => (data: T): boolean => {
    const value = data[field] as string;
    if (!value) return true;
    return value.length >= min;
  },
  
  numberRange: <T>(field: keyof T, min?: number, max?: number) => (data: T): boolean => {
    const value = data[field] as number;
    if (value === undefined || value === null) return true;
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  },
  
  crossField: <T>(field1: keyof T, field2: keyof T, validator: (val1: any, val2: any) => boolean) => 
    (data: T): boolean => {
      return validator(data[field1], data[field2]);
    }
};
