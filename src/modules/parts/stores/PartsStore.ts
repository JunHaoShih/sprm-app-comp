import { defineStore } from 'pinia';
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
      if (!part.checkoutId) {
        return false;
      }
      return part.checkoutId !== part.version.id;
    },
    records: (state): Record<string, unknown>[] => {
      const newRecords = state.parts.map((part) => {
        const record: Record<string, unknown> = part;
        if (part.version.customValues) {
          Object.keys(part.version.customValues).forEach((key) => {
            // TODO check if single select, get display value
            const currentValue = part.version.customValues[key];
            record[key] = currentValue;
          });
        }
        return record;
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
  },
});
