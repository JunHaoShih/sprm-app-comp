import { ViewType } from '../models/Part';

export interface CreatePartDTO {
  number: string,
  name: string,
  remarks: string,
  viewType: ViewType,
  customValues: Record<string, string>,
}
