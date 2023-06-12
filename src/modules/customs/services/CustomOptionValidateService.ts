import { ValidateRule, genericRulesCheck } from 'src/models/ValidateRule';

const validateOptionKeyRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length <= 20,
    message: 'validations.customAttributes.options.longerThan20',
  },
  {
    validate: (val) => /^[A-Z0-9_-]*$/.test(String(val)),
    message: 'validations.customAttributes.options.keyInvalidChar',
  },
];

const validateOptionValueRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length <= 20,
    message: 'validations.customAttributes.options.longerThan20',
  },
  {
    validate: (val) => /^[^\\\\/:*?"<>|]+$/.test(String(val)),
    message: 'validations.customAttributes.options.valueInvalidChar',
  },
];

const optionKeyRules = (optionKey: string) => (
  genericRulesCheck(optionKey, validateOptionKeyRules)
);

const optionValueRules = (optionValue: string) => (
  genericRulesCheck(optionValue, validateOptionValueRules)
);

export const customOptionValidateService = {
  optionValueRules,
  optionKeyRules,
};
