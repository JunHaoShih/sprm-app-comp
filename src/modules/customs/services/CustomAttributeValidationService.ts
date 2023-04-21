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
    validate: (val) => val.length <= 20,
    message: 'validations.customAttributes.longerThan20',
  },
  {
    validate: (val) => /^[A-Z0-9_-]*$/.test(val),
    message: 'validations.customAttributes.numberInvalidChar',
  },
];

export const validateAttributeNameRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => val.length <= 20,
    message: 'validations.customAttributes.longerThan20',
  },
  {
    validate: (val) => /^[^\\\\/:*?"<>|]+$/.test(val),
    message: 'validations.customAttributes.nameInvalidChar',
  },
];

const checkAttributeNumberRules = (number: string): string | undefined => {
  const result = validateAttributeNumberRules.find((rule) => !rule.validate(number));
  if (result) {
    return result.message;
  }
  return result;
};

const checkAttributeNameRules = (number: string): string | undefined => {
  const result = validateAttributeNameRules.find((rule) => !rule.validate(number));
  if (result) {
    return result.message;
  }
  return result;
};

const checkAttributeRules = (attribute: CustomAttribute): string | undefined => {
  let result = checkAttributeNumberRules(attribute.number);
  if (result) {
    return result;
  }
  result = checkAttributeNameRules(attribute.name);
  if (result) {
    return result;
  }
  for (let i = 0; i < attribute.options.length; i += 1) {
    result = customOptionValidateService.checkOptionRules(attribute.options[i]);
    if (result) {
      return result;
    }
  }
  const keys = Object.keys(attribute.languages);
  for (let i = 0; i < keys.length; i += 1) {
    result = languageValidateService.checkLanguageRules(attribute.languages[keys[i]]);
    if (result) {
      return result;
    }
  }
  return result;
};

const checkCreateAttributeRules = (attribute: CreateCustomAttributeDTO): string | undefined => {
  let result = checkAttributeNumberRules(attribute.number);
  if (result) {
    return result;
  }
  result = checkAttributeNameRules(attribute.name);
  if (result) {
    return result;
  }
  for (let i = 0; i < attribute.options.length; i += 1) {
    result = customOptionValidateService.checkOptionRules(attribute.options[i]);
    if (result) {
      return result;
    }
  }
  const keys = Object.keys(attribute.languages);
  for (let i = 0; i < keys.length; i += 1) {
    result = languageValidateService.checkLanguageRules(attribute.languages[keys[i]]);
    if (result) {
      return result;
    }
  }
  return result;
};

export const customAttributeValidationService = {
  checkAttributeNumberRules,
  checkAttributeNameRules,
  checkAttributeRules,
  checkCreateAttributeRules,
};
