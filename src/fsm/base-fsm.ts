export type FiledName = string;

export type ConditionFn<T> = (formData: T) => unknown | Promise<unknown>;

export interface FiledRule<T> {
  condition?: ConditionFn<T>;
  error: string;
}
export type FieldError = {
  field: string;
  message: string;
};
export type FormRules<T> = {
  [K in keyof T]: FiledRule<T>[];
};
export async function validateFlow<T>(
  data: T,
  rules: FormRules<T>,
): Promise<FieldError[]> {
  const erros: FieldError[] = [];
  for (const key of Object.keys(rules) as (keyof T)[]) {
    const fieldRules = rules[key];
    for (const rule of fieldRules) {
      const rawConditionResult = rule.condition
        ? await rule.condition(data)
        : true;
      const isError = Boolean(rawConditionResult);
      if (isError) {
        erros.push({
          field: key as string,
          message: rule.error,
        });
        break;
      }
    }
  }
  return erros;
}
