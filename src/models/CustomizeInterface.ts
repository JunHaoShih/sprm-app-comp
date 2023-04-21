import { ReturnBase } from './ReturnBase';

/**
 * 可自定義類型
 */
export interface CustomizeInterface extends ReturnBase {
  number: string,
  name: string,
  isSystemDefault: boolean,
  languages: Record<string, string>,
}
