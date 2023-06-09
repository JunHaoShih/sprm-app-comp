import { ValidateRule, genericRulesCheck } from 'src/models/ValidateRule';

const validateAttributeNumberRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length <= 20,
    message: 'validations.customAttributes.longerThan20',
  },
  {
    validate: (val) => /^[A-Z0-9_-]*$/.test(String(val)),
    message: 'validations.customAttributes.numberInvalidChar',
  },
];

const validateAttributeNameRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length <= 20,
    message: 'validations.customAttributes.longerThan20',
  },
  {
    validate: (val) => /^[^\\/:*?"<>|]+$/.test(String(val)),
    message: 'validations.customAttributes.nameInvalidChar',
  },
];

export const customAttributeValidationService = {
  attributeNumberRules: (number: string) => (
    genericRulesCheck(number, validateAttributeNumberRules)
  ),
  attributeNameRules: (number: string) => (
    genericRulesCheck(number, validateAttributeNameRules)
  ),
};
