import { ValidateRule } from 'src/models/ValidateRule';

const validateLanguageRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => val.length <= 20,
    message: 'validations.languages.longerThan20',
  },
  {
    validate: (val) => /^[^\\\\/:*?"<>|]+$/.test(val),
    message: 'validations.languages.invalidChar',
  },
];

const checkLanguageRules = (number: string): string | undefined => {
  const result = validateLanguageRules.find((rule) => !rule.validate(number));
  if (result) {
    return result.message;
  }
  return result;
};

export const languageValidateService = {
  checkLanguageRules,
};
