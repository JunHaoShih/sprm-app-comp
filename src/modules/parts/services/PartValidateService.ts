import { ValidateRule } from 'src/models/ValidateRule';
import { i18n } from 'src/boot/i18n';

const validateNumberRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length >= 3,
    message: 'validations.parts.shorterThan3',
  },
  {
    validate: (val) => String(val).length <= 50,
    message: 'validations.parts.longerThan50',
  },
  {
    validate: (val) => /^[a-zA-Z0-9_-]*$/.test(String(val)),
    message: 'validations.parts.invalidChar',
  },
];

const validateNameRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length <= 50,
    message: 'validations.parts.longerThan50',
  },
  {
    validate: (val) => /^[^\\\\/:*?"<>|]+$/.test(String(val)),
    message: 'validations.parts.invalidChar',
  },
];

const genericRulesCheck = (val: string, rules: ValidateRule[]) => {
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

const numberRules = (val: string) => (
  genericRulesCheck(val, validateNumberRules)
);

const nameRules = (val: string) => (
  genericRulesCheck(val, validateNameRules)
);

export const partValidationService = {
  numberRules,
  nameRules,
};
