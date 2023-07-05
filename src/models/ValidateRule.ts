import { i18n } from 'src/boot/i18n';

export type VaildateType = string | number | undefined;

export interface ValidateRule {
  validate: (val: VaildateType) => boolean,
  message: string,
}

export const genericRulesCheck = (val: VaildateType, rules: ValidateRule[]) => {
  const errors: string[] = [];
  rules
    .filter((rule) => !rule.validate(val))
    .forEach((rule) => errors.push(rule.message));
  if (errors.length > 0) {
    const error = errors[0];
    return i18n.global.t(error);
  }
  return true;
};

export function invalidChars(val: VaildateType) {
  return /^[^\\/:*?"<>|]+$/.test(String(val));
}
