import { ValidateRule, genericRulesCheck } from 'src/models/ValidateRule';

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

const quantityRules = (quantity: string) => (
  genericRulesCheck(String(quantity), validateQuantityRules)
);

export const partUsageValiationService = {
  quantityRules,
};
