import { ValidateRule, genericRulesCheck, invalidChars } from 'src/models/ValidateRule';

const validateUsernameRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length >= 6,
    message: 'validations.cannotSmallerThan6',
  },
  {
    validate: (val) => String(val).length <= 20,
    message: 'validations.cannotLongerThan20',
  },
  {
    validate: (val) => /^[a-zA-Z0-9_]+$/.test(String(val)),
    message: 'validations.invalidChar',
  },
];

const validatepasswordRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length >= 6,
    message: 'validations.cannotSmallerThan6',
  },
];

const validateFullNameRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length <= 50,
    message: 'validations.cannotLongerThan50',
  },
  {
    validate: invalidChars,
    message: 'validations.invalidChar',
  },
];

export const appUserValidateService = {
  usernameRules: (val: string) => (
    genericRulesCheck(val, validateUsernameRules)
  ),
  passwordRules: (val: string) => (
    genericRulesCheck(val, validatepasswordRules)
  ),
  fullNameRules: (val: string) => (
    genericRulesCheck(val, validateFullNameRules)
  ),
};
