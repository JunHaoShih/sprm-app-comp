import { defineStore } from 'pinia';
import { Part, PartVersionInfo } from '../models/Part';

export interface PartsContainer {
  parts: Part[],
}

export const partsStore = defineStore('parts', {
  state: (): PartsContainer => ({
    parts: [],
  }),
  getters: {
    getVersion: (state) => (partVersion: PartVersionInfo): string => {
      const versionStr = `${partVersion.version}`;
      return versionStr;
    },
    isInitialized: (state) => (part: Part): boolean => {
      if (!part.checkoutId) {
        return false;
      }
      return part.checkoutId !== part.version.id;
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
