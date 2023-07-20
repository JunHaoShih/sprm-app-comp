import { ReturnBase } from 'src/models/ReturnBase';

export interface RoutingMasterInfo extends ReturnBase {
  name: string,
  checkout: boolean,
  partId: number,
}

export interface RoutingVersion extends ReturnBase {
  master: RoutingMasterInfo,
  version: number,
  isDraft: boolean,
  isLatest: boolean,
  customValues: Record<string, string>,
}
