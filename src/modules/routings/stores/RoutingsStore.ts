import { defineStore } from 'pinia';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { useI18n } from 'vue-i18n';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { customValueRecordService } from 'src/services/CustomValueRecordService';
import { Routing } from '../models/Routing';

export interface RoutingsContainer {
  routings: Routing[],
}

export const useRoutingsStore = defineStore('routings', {
  state: (): RoutingsContainer => ({
    routings: [],
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
      const newRecords = state.routings.map((routing) => {
        const record: Record<string, unknown> = routing;
        if (!routing.version.customValues) {
          return record;
        }
        const customAttributes = attrLinksStore.attributes(SprmObjectType.PartVersion);
        const newRecord = customValueRecordService
          .toRecord(record, customAttributes, routing.version.customValues, lang);
        return newRecord;
      });
      return newRecords;
    },
  },
  actions: {
    addRouting(routing: Routing): void {
      this.routings.push(routing);
    },
    unshiftRouting(routing: Routing): void {
      this.routings.unshift(routing);
    },
    updateRouting(routing: Routing): void {
      const index = this.routings.findIndex((currentRouting) => currentRouting.id === routing.id);
      this.routings[index] = routing;
    },
  },
});
