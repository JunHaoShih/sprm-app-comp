import { ValidateRule, genericRulesCheck } from 'src/models/ValidateRule';

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

export const routingUsageValidationService = {
  numberRules: (val: string) => (
    genericRulesCheck(val, validateNumberRules)
  ),
};
