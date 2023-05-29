import { ValidateRule } from 'src/models/ValidateRule';
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

export const validateAttributeNameRules: ValidateRule[] = [
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

const checkAttributeNumberRules = (number: string | number | undefined): string[] => {
  const errors = validateAttributeNumberRules
    .filter((rule) => !rule.validate(number))
    .map((rule) => rule.message);
  return errors;
};

const checkAttributeNameRules = (name: string | number | undefined): string[] => {
  const errors = validateAttributeNameRules
    .filter((rule) => !rule.validate(name))
    .map((rule) => rule.message);
  return errors;
};

const checkAttributeRules = (attribute: CustomAttribute): string[] => {
  const errors: string[] = [];
  errors.push(...checkAttributeNumberRules(attribute.number));
  errors.push(...checkAttributeNameRules(attribute.name));
  attribute.options.forEach((option) => {
    errors.push(...customOptionValidateService.checkOptionRules(option));
  });
  const keys = Object.keys(attribute.languages);
  keys.forEach((key) => {
    errors.push(...languageValidateService.checkLanguageRules(attribute.languages[key]));
  });
  return errors;
};

const checkCreateAttributeRules = (attribute: CreateCustomAttributeDTO): string[] => {
  const errors: string[] = [];
  errors.push(...checkAttributeNumberRules(attribute.number));
  errors.push(...checkAttributeNameRules(attribute.name));
  attribute.options.forEach((option) => {
    errors.push(...customOptionValidateService.checkOptionRules(option));
  });
  const keys = Object.keys(attribute.languages);
  keys.forEach((key) => {
    errors.push(...languageValidateService.checkLanguageRules(attribute.languages[key]));
  });
  return errors;
};

export const customAttributeValidationService = {
  checkAttributeNumberRules,
  checkAttributeNameRules,
  checkAttributeRules,
  checkCreateAttributeRules,
};
