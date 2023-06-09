import { ValidateRule, genericRulesCheck } from 'src/models/ValidateRule';

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
    validate: (val) => /^[^\\/:*?"<>|]+$/.test(String(val)),
    message: 'validations.languages.invalidChar',
  },
];

export const languageValidateService = {
  languageRules: (language: string) => (
    genericRulesCheck(language, validateLanguageRules)
  ),
};
