import { ValidateRule, genericRulesCheck } from 'src/models/ValidateRule';

const validateNumberRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length >= 2,
    message: 'validations.processes.shorterThan2',
  },
  {
    validate: (val) => String(val).length <= 20,
    message: 'validations.processes.longerThan20',
  },
  {
    validate: (val) => /^[a-zA-Z0-9_-]*$/.test(String(val)),
    message: 'validations.processes.invalidChar',
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
    validate: (val) => /^[^\\/:*?"<>|]+$/.test(String(val)),
    message: 'validations.parts.invalidChar',
  },
];

const validateImportTimeRules: ValidateRule[] = [
  {
    validate: (val) => !!val || Number(val) === 0,
    message: 'validations.notNull',
  },
  {
    validate: (val) => Number(val) >= 0,
    message: 'validations.cannotSmallerThan0',
  },
];

export const processValidationService = {
  numberRules: (val: string | number | undefined) => (
    genericRulesCheck(val, validateNumberRules)
  ),
  nameRules: (val: string | number | undefined) => (
    genericRulesCheck(val, validateNameRules)
  ),
  timeRules: (val: string | number | undefined) => (
    genericRulesCheck(val, validateImportTimeRules)
  ),
};
