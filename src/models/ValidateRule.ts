export interface ValidateRule {
  validate: (val: string) => boolean,
  message: string,
}
