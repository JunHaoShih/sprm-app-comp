import { defineStore } from 'pinia';
import { ProcessType } from 'src/modules/processTypes/models/ProcessType';
import { MakeType } from 'src/modules/makeTypes/models/MakeType';
import { Process } from '../models/Process';
import { processService } from '../services/ProcessService';

interface ProcessContainer {
  content: Process
}

export const useProcessStore = defineStore('process', {
  state: (): ProcessContainer => ({
    content: {
      id: 0,
      number: '',
      name: '',
      processType: {} as ProcessType,
      defaultMakeType: {} as MakeType,
      defaultExportTime: 0,
      defaultImportTime: 0,
      customValues: {} as Record<string, string>,
      createUser: '',
      createDate: new Date(),
      updateUser: '',
      updateDate: new Date(),
      remarks: '',
    },
  }),
  actions: {
    async processInit(processId: number): Promise<boolean> {
      if (processId === this.content.id) {
        return true;
      }
      this.content = {
        id: 0,
        number: '',
        name: '',
        processType: {} as ProcessType,
        defaultMakeType: {} as MakeType,
        defaultExportTime: 0,
        defaultImportTime: 0,
        customValues: {} as Record<string, string>,
        createUser: '',
        createDate: new Date(),
        updateUser: '',
        updateDate: new Date(),
        remarks: '',
      } as Process;
      const targetVersion = await processService.getById(processId);
      if (!targetVersion) {
        return false;
      }
      this.content = targetVersion;
      return true;
    },
  },
});
