import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { api } from 'src/boot/axios';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { customValueRecordService } from 'src/services/CustomValueRecordService';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { RoutingUsage } from '../models/RoutingUsage';
import { CreateRoutingUsageDTO } from '../dtos/CreateRoutingUsageDTO';

export const routingUsageService = {
  getByRootVersionId: async (rootVersionId: number): Promise<RoutingUsage[] | null> => {
    const searchUrl = `/api/RoutingVersion/${rootVersionId}/RoutingUsage`;
    const partUsages = await api.get(encodeURI(searchUrl))
      .then((response): RoutingUsage[] => {
        const data = response.data as SPRMResponse<RoutingUsage[]>;
        return data.content;
      })
      .catch((error) => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          const message = `Error: ${body.code}, ${body.message}`;
          Notify.create({
            message,
            color: 'red',
            icon: 'error',
          });
        }
        return null;
      });
    return partUsages;
  },
  insert: async (dto: CreateRoutingUsageDTO) => {
    const partUsages = await api.post('/api/RoutingUsage', dto)
      .then((response): RoutingUsage => {
        const data = response.data as SPRMResponse<RoutingUsage>;
        return data.content;
      })
      .catch((error) => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          const message = `Error: ${body.code}, ${body.message}`;
          Notify.create({
            message,
            color: 'red',
            icon: 'error',
          });
        }
        return null;
      });
    return partUsages;
  },
  remove: async (id: number): Promise<boolean> => {
    const success = await api.delete(`/api/RoutingUsage/${id}`)
      .then((): boolean => true)
      .catch((error) => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          const message = `Error: ${body.code}, ${body.message}`;
          Notify.create({
            message,
            color: 'red',
            icon: 'error',
          });
        }
        return false;
      });
    return success;
  },
  /**
   * Convert routing usages to records
   * @param routingUsages Routing usages
   * @returns Parsed records
   */
  toRecords: (routingUsages: RoutingUsage[]): Record<string, unknown>[] => {
    const attrLinksStore = useAttributeLinksStore();
    const i18n = useI18n();
    const lang = i18n.locale.value;
    const newRecords = routingUsages.map((routingUsage) => {
      const record: Record<keyof RoutingUsage, unknown> = routingUsage;
      if (!routingUsage.customValues) {
        return record;
      }
      const customAttributes = attrLinksStore.attributes(SprmObjectType.RoutingUsage);
      const newRecord = customValueRecordService
        .toRecord(record, customAttributes, routingUsage.customValues, lang);
      return newRecord;
    });
    return newRecords;
  },
};
