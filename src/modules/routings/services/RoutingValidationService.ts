import { ValidateRule, genericRulesCheck } from 'src/models/ValidateRule';

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
    validate: (val) => /^[^\\/:*?"<>|]+$/.test(String(val)),
    message: 'validations.processes.invalidChar',
  },
];

export const routingValidationService = {
  nameRules: (val: string) => (
    genericRulesCheck(val, validateNameRules)
  ),
};
