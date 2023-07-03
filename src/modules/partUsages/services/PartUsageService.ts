import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18n';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { customValueRecordService } from 'src/services/CustomValueRecordService';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { PartUsageChild } from '../models/PartUsageUses';
import { CreatePartUsagesDTO } from '../dtos/CreatePartUsagesDTO';
import { UpdatePartUsageDTO } from '../dtos/UpdatePartUsageDTO';

export const partUsageService = {
  getByParentVersionId: async (parentVersionId: number): Promise<PartUsageChild[] | null> => {
    const searchUrl = `/api/PartUsage/ByParent/${parentVersionId}`;
    const partUsages = await api.get(encodeURI(searchUrl))
      .then((response): PartUsageChild[] => {
        const data = response.data as SPRMResponse<PartUsageChild[]>;
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
  toRecords: (partUsageChildren: PartUsageChild[]): Record<string, unknown>[] => {
    const attrLinksStore = useAttributeLinksStore();
    const lang = i18n.global.locale.value;
    const newRecords = partUsageChildren.map((routingUsage) => {
      const record: Record<keyof PartUsageChild, unknown> = routingUsage;
      if (!routingUsage.customValues) {
        return record;
      }
      const customAttributes = attrLinksStore.attributes(SprmObjectType.PartUsage);
      const newRecord = customValueRecordService
        .toRecord(record, customAttributes, routingUsage.customValues, lang);
      return newRecord;
    });
    return newRecords;
  },
  insert: async (createDto: CreatePartUsagesDTO): Promise<PartUsageChild[] | null> => {
    const partUsages = await api.post('/api/PartUsage', createDto)
      .then((response): PartUsageChild[] => {
        const data = response.data as SPRMResponse<PartUsageChild[]>;
        return data.content;
      })
      .catch((error) => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          let bodyMessage = '';
          if (body.code === 301) {
            bodyMessage = i18n.global.t('parts.usages.alreadyExist');
          } else {
            bodyMessage = body.message;
          }
          const message = `Error: ${body.code}, ${bodyMessage}`;
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
    const success = await api.delete(`/api/PartUsage/${id}`)
      .then((): boolean => true)
      .catch((error): boolean => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          let bodyMessage = '';
          if (body.code === 302) {
            bodyMessage = i18n.global.t('parts.usages.notExist');
          } else {
            bodyMessage = body.message;
          }
          const message = `Error: ${body.code}, ${bodyMessage}`;
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
  update: async (id: number, dto: UpdatePartUsageDTO) => {
    const success = await api.put(`/api/PartUsage/${id}`, dto)
      .then((): boolean => true)
      .catch((error): boolean => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          let bodyMessage = '';
          if (body.code === 302) {
            bodyMessage = i18n.global.t('parts.usages.notExist');
          } else {
            bodyMessage = body.message;
          }
          const message = `Error: ${body.code}, ${bodyMessage}`;
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
};
