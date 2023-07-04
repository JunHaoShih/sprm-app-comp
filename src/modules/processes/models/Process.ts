import { ReturnBase } from 'src/models/ReturnBase';
import { MakeType } from 'src/modules/makeTypes/models/MakeType';
import { ProcessType } from 'src/modules/processTypes/models/ProcessType';

export interface Process extends ReturnBase {
  number: string,
  name: string,
  defaultImportTime: number,
  defaultExportTime: number,
  processType: ProcessType,
  defaultMakeType: MakeType,
  customValues: Record<string, string>,
}
