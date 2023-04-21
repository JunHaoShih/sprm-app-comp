import { ReturnBase } from 'src/models/ReturnBase';
import { ViewType } from './Part';

export interface PartMaster {
  id: number,
  number: string,
  name: string,
  viewType: ViewType,
  checkout: boolean,
}

export interface PartVersion extends ReturnBase {
  version: number,
  checkout: boolean,
  master: PartMaster,
  customValues: Record<string, string>,
}
