import { ReturnBase } from 'src/models/ReturnBase';

export interface ProcessType extends ReturnBase {
  number: string,
  name: string,
  isSystemDefault: boolean,
  languages: Record<string, string>,
}
