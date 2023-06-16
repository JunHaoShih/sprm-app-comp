import { ReturnBase } from 'src/models/ReturnBase';

/**
 * 工藝路徑版本資訊(For Routing interface only)
 */
export interface RoutingVersionInfo extends ReturnBase {
  masterId: number,
  version: number,
  isLatest: boolean,
  isDraft: boolean,
  customValues: Record<string, string>,
}

/**
 * 工藝路徑
 */
export interface Routing extends ReturnBase {
  partId: number,
  name: string,
  checkout: boolean,
  draftId: number,
  version: RoutingVersionInfo,
}
