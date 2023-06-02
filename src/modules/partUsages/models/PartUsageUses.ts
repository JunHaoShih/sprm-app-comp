import { ReturnBase } from 'src/models/ReturnBase';
import { Part } from 'src/modules/parts/models/Part';

export interface PartUsageChild extends ReturnBase {
  parentId: number,
  child: Part,
  quantity: number,
  customValues: Record<string, string>,
}
