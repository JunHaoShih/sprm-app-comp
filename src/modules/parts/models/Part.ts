import { ReturnBase } from 'src/models/ReturnBase';
import { SelectOption } from 'src/models/SelectOption';

export enum ViewType {
  Design = 0,
  Manufacturing = 1,
}

export type ViewTypeOption = SelectOption<ViewType>

export interface PartVersionInfo extends ReturnBase {
  masterId: number,
  version: number,
  isLatest: boolean,
  checkout: boolean,
  customValues: Record<string, string>,
}

export interface Part extends ReturnBase {
  number: string,
  name: string,
  viewType: ViewType,
  checkout: boolean,
  checkoutId: number | null,
  version: PartVersionInfo,
}
