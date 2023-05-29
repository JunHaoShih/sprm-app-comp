import { ValidateRule } from 'src/models/ValidateRule';

const validateLanguageRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length <= 20,
    message: 'validations.languages.longerThan20',
  },
  {
    validate: (val) => /^[^\\\\/:*?"<>|]+$/.test(String(val)),
    message: 'validations.languages.invalidChar',
  },
];

const checkLanguageRules = (language: string | number | undefined): string[] => {
  const errors = validateLanguageRules
    .filter((rule) => !rule.validate(language))
    .map((rule) => rule.message);
  return errors;
};

export const languageValidateService = {
  checkLanguageRules,
};
