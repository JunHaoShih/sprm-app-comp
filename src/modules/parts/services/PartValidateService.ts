import { ValidateRule } from 'src/models/ValidateRule';
import { Part } from '../models/Part';
import { CreatePartDTO } from '../dtos/CreatePartDTO';

export const validateNumberRules: ValidateRule[] = [
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

export const validateNameRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => String(val).length <= 50,
    message: 'validations.parts.longerThan50',
  },
  {
    validate: (val) => /^[^\\\\/:*?"<>|]+$/.test(String(val)),
    message: 'validations.parts.invalidChar',
  },
];

const checkNumberRules = (number: string | number | undefined): string[] => {
  const errors = validateNumberRules
    .filter((rule) => !rule.validate(number))
    .map((rule) => rule.message);
  return errors;
};

const checkNameRules = (name: string | number | undefined): string[] => {
  const errors = validateNameRules
    .filter((rule) => !rule.validate(name))
    .map((rule) => rule.message);
  return errors;
};

const checkPartRules = (part: Part): string[] => {
  const errors: string[] = [];
  errors.push(...checkNumberRules(part.number));
  errors.push(...checkNameRules(part.name));
  return errors;
};

const checkCreatePartRules = (part: CreatePartDTO): string[] => {
  const errors: string[] = [];
  errors.push(...checkNumberRules(part.number));
  errors.push(...checkNameRules(part.name));
  return errors;
};

export const partValidationService = {
  checkNumberRules,
  checkNameRules,
  checkPartRules,
  checkCreatePartRules,
};
