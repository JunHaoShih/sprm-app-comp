import { ValidateRule } from 'src/models/ValidateRule';

const validateQuantityRules: ValidateRule[] = [
  {
    validate: (val) => !!val,
    message: 'validations.notNull',
  },
  {
    validate: (val) => /^[1-9]\d*$/.test(String(val)),
    message: 'validations.partUsages.quantity.atLeastOne',
  },
];

const validateQuantity = (quantity: string | number | undefined): string[] => {
  const errors = validateQuantityRules
    .filter((rule) => !rule.validate(quantity))
    .map((rule) => rule.message);
  return errors;
};

export const partUsageValiationService = {
  validateQuantity,
};
