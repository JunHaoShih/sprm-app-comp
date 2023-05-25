export interface ValidateRule {
  validate: (val: string | number | undefined) => boolean,
  message: string,
}
