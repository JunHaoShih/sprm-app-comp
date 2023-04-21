import { ValidateRule } from 'src/models/ValidateRule';
import { CustomOption } from '../models/CustomAttribute';
import { languageValidateService } from './LanguageValidateService';

const validateOptionKeyRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => val.length <= 20,
    message: 'validations.customAttributes.options.longerThan20',
  },
  {
    validate: (val) => /^[A-Z0-9_-]*$/.test(val),
    message: 'validations.customAttributes.options.keyInvalidChar',
  },
];

export const validateOptionValueRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => val.length <= 20,
    message: 'validations.customAttributes.options.longerThan20',
  },
  {
    validate: (val) => /^[^\\\\/:*?"<>|]+$/.test(val),
    message: 'validations.customAttributes.options.valueInvalidChar',
  },
];

const checkOptionKeyRules = (number: string): string | undefined => {
  const result = validateOptionKeyRules.find((rule) => !rule.validate(number));
  if (result) {
    return result.message;
  }
  return result;
};

const checkOptionValueRules = (number: string): string | undefined => {
  const result = validateOptionValueRules.find((rule) => !rule.validate(number));
  if (result) {
    return result.message;
  }
  return result;
};

const checkOptionRules = (option: CustomOption): string | undefined => {
  let result = checkOptionKeyRules(option.key);
  if (result) {
    return result;
  }
  result = checkOptionValueRules(option.value);
  if (result) {
    return result;
  }
  const keys = Object.keys(option.languages);
  for (let i = 0; i < keys.length; i += 1) {
    result = languageValidateService.checkLanguageRules(option.languages[keys[i]]);
    if (result) {
      return result;
    }
  }
  return result;
};

export const customOptionValidateService = {
  checkOptionKeyRules,
  checkOptionValueRules,
  checkOptionRules,
};
