import { ReturnBase } from 'src/models/ReturnBase';

export interface RoutingUsage extends ReturnBase {
  customValues: Record<string, string>,
  number: string,
  rootVersionId: number,
  parentUsageId: number | null,
  processId: number,
  processNumber: string,
  processName: string,
}
