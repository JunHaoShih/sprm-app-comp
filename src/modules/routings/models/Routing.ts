import { ReturnBase } from 'src/models/ReturnBase';

export interface Routing extends ReturnBase {
  partId: number,
  name: string,
  checkout: boolean
}
