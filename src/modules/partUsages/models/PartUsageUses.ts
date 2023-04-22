import { ReturnBase } from 'src/models/ReturnBase';
import { Part } from 'src/modules/parts/models/Part';

export interface PartUsageChild extends ReturnBase {
  usedBy: number,
  uses: Part,
  quantity: number,
}
