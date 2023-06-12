import { i18n } from 'src/boot/i18n';

export interface ValidateRule {
  validate: (val: string | number | undefined) => boolean,
  message: string,
}

export const genericRulesCheck = (val: string, rules: ValidateRule[]) => {
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
