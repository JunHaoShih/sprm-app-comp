import { ReturnBase } from 'src/models/ReturnBase';

export interface RoutingVersion extends ReturnBase {
  version: number,
  isDraft: boolean,
  isLatest: boolean,
  customValues: Record<string, string>,
}
