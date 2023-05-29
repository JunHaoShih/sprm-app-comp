import { ValidateRule } from 'src/models/ValidateRule';
import { CustomOption } from '../models/CustomAttribute';
import { languageValidateService } from './LanguageValidateService';

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

export const validateOptionValueRules: ValidateRule[] = [
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

const checkOptionKeyRules = (optionKey: string | number | undefined): string[] => {
  const errors = validateOptionKeyRules
    .filter((rule) => !rule.validate(optionKey))
    .map((rule) => rule.message);
  return errors;
};

const checkOptionValueRules = (optionValue: string | number | undefined): string[] => {
  const errors = validateOptionValueRules
    .filter((rule) => !rule.validate(optionValue))
    .map((rule) => rule.message);
  return errors;
};

const checkOptionRules = (option: CustomOption): string[] => {
  const errors: string[] = [];
  const keys = Object.keys(option.languages);
  errors.push(...checkOptionKeyRules(option.key));
  errors.push(...checkOptionValueRules(option.value));
  keys.forEach((key) => {
    errors.push(...languageValidateService.checkLanguageRules(option.languages[key]));
  });
  return errors;
};

export const customOptionValidateService = {
  checkOptionKeyRules,
  checkOptionValueRules,
  checkOptionRules,
};
