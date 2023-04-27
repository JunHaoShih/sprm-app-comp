import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { DisplayType } from 'src/modules/customs/models/CustomAttribute';
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
        const customAttributes = attrLinksStore.attributes(ObjectTypeId.PartVersion);
        Object.keys(part.version.customValues).forEach((key) => {
          const targetAttribute = customAttributes.find((attr) => attr.number === key);
          if (!targetAttribute) {
            return;
          }
          if (targetAttribute.displayType !== DisplayType.SingleSelect) {
            const currentValue = part.version.customValues[key];
            record[key] = currentValue;
            return;
          }
          // Get single select option
          const currentValue = part.version.customValues[key];
          const targetOption = targetAttribute.options.find(
            (option) => option.key === currentValue,
          );
          // Display raw value if option is not found
          if (!targetOption) {
            record[key] = currentValue;
            return;
          }
          // Get display value of current language
          const display = targetOption.languages[lang];
          if (display) {
            // Display language
            record[key] = display;
          } else {
            // Show default value if language display not found
            record[key] = targetOption.value;
          }
        });
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
