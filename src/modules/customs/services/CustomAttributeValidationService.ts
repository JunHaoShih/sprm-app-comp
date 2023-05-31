import { ValidateRule, genericRulesCheck } from 'src/models/ValidateRule';
import { customOptionValidateService } from './CustomOptionValidateService';
import { CustomAttribute } from '../models/CustomAttribute';
import { CreateCustomAttributeDTO } from '../dtos/CreateCustomAttributeDTO';
import { languageValidateService } from './LanguageValidateService';

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
    validate: (val) => /^[^\\\\/:*?"<>|]+$/.test(String(val)),
    message: 'validations.customAttributes.nameInvalidChar',
  },
];

const attributeNumberRules = (number: string) => (
  genericRulesCheck(number, validateAttributeNumberRules)
);

const attributeNameRules = (number: string) => (
  genericRulesCheck(number, validateAttributeNameRules)
);

export const customAttributeValidationService = {
  attributeNumberRules,
  attributeNameRules,
};
