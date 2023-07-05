import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { customValueRecordService } from 'src/services/CustomValueRecordService';
import { Process } from '../models/Process';

export interface ProcessesContainer {
  processes: Process[],
}

export const useProcessesStore = defineStore('processes', {
  state: (): ProcessesContainer => ({
    processes: [],
  }),
  getters: {
    /**
     * Convert parts to records, so custom values are able to display in table
     * @param state store state
     * @returns record array
     */
    records: (state): Record<string, unknown>[] => {
      const attrLinksStore = useAttributeLinksStore();
      const i18n = useI18n();
      const lang = i18n.locale.value;
      const newRecords = state.processes.map((process) => {
        const record: Record<string, unknown> = process;
        if (!process.customValues) {
          return record;
        }
        const customAttributes = attrLinksStore.attributes(SprmObjectType.PartVersion);
        const newRecord = customValueRecordService
          .toRecord(record, customAttributes, process.customValues, lang);
        return newRecord;
      });
      return newRecords;
    },
    displayProcessTypeName: () => (process: Process): string => {
      const i18n = useI18n();
      const lang = i18n.locale.value;
      if (!process.processType.languages) {
        return process.processType.name;
      }
      const display = process.processType.languages[lang];
      return display ?? process.processType.name;
    },
    displayMakeTypeName: () => (process: Process): string => {
      const i18n = useI18n();
      const lang = i18n.locale.value;
      if (!process.defaultMakeType.languages) {
        return process.defaultMakeType.name;
      }
      const display = process.defaultMakeType.languages[lang];
      return display ?? process.defaultMakeType.name;
    },
  },
  actions: {
    addProcess(process: Process): void {
      this.processes.push(process);
    },
    unshiftProcess(process: Process): void {
      this.processes.unshift(process);
    },
    updateProcess(process: Process): void {
      const index = this.processes.findIndex((currentProcess) => currentProcess.id === process.id);
      this.processes[index] = process;
    },
    removeProcess(process: Process): void {
      const index = this.processes.findIndex((currentProcess) => currentProcess.id === process.id);
      if (index >= 0) {
        this.processes.splice(index, 1);
      }
    },
  },
});
