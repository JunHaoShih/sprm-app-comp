import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { customValueRecordService } from 'src/services/CustomValueRecordService';
import { Part, PartVersionInfo } from '../models/Part';

export interface PartsContainer {
  parts: Part[],
}

export const usePartsStore = defineStore('parts', {
  state: (): PartsContainer => ({
    parts: [],
  }),
  getters: {
    getVersion: () => (partVersion: PartVersionInfo): string => {
      const versionStr = `${partVersion.version}`;
      return versionStr;
    },
    isInitialized: () => (part: Part): boolean => {
      if (!part.draftId) {
        return false;
      }
      return part.draftId !== part.version.id;
    },
    /**
     * Convert parts to records, so custom values are able to display in table
     * @param state store state
     * @returns record array
     */
    records: (state): Record<string, unknown>[] => {
      const attrLinksStore = useAttributeLinksStore();
      const i18n = useI18n();
      const lang = i18n.locale.value;
      const newRecords = state.parts.map((part) => {
        const record: Record<string, unknown> = part;
        if (!part.version.customValues) {
          return record;
        }
        const customAttributes = attrLinksStore.attributes(SprmObjectType.PartVersion);
        const newRecord = customValueRecordService
          .toRecord(record, customAttributes, part.version.customValues, lang);
        return newRecord;
      });
      return newRecords;
    },
  },
  actions: {
    addPart(part: Part): void {
      this.parts.push(part);
    },
    unshiftPart(part: Part): void {
      this.parts.unshift(part);
    },
    updatePart(part: Part): void {
      const index = this.parts.findIndex((currentPart) => currentPart.id === part.id);
      this.parts[index] = part;
    },
  },
});
