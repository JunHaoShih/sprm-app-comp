import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { DisplayType } from 'src/modules/customs/models/CustomAttribute';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { PartUsageChild } from '../models/PartUsageUses';

const getByParentVersionId = async (parentVersionId: number): Promise<PartUsageChild[] | null> => {
  const searchUrl = `/api/PartUsage/ByParent/${parentVersionId}`;
  const partUsages = await api.get(encodeURI(searchUrl))
    .then((response): PartUsageChild[] => {
      const data = response.data as SPRMResponse<PartUsageChild[]>;
      return data.content;
    })
    .catch((error) => {
      let message = '';
      if (error.response) {
        const body: SPRMResponse<string> = error.response.data;
        message = `Error: ${body.code}, ${body.message}`;
      } else if (error.request) {
        // The request was made but no response was received
        message = 'Error: No response';
      } else {
        // Something happened in setting up the request that triggered an Error
        message = 'Something went wrong';
      }
      Notify.create({
        message,
        color: 'red',
        icon: 'error',
      });
      return null;
    });
  return partUsages;
};

const toRecords = (partUsageChildren: PartUsageChild[]): Record<string, unknown>[] => {
  const attrLinksStore = useAttributeLinksStore();
  const i18n = useI18n();
  const lang = i18n.locale.value;
  const newRecords = partUsageChildren.map((partUsage) => {
    const record: Record<keyof PartUsageChild, unknown> = partUsage;
    if (!partUsage.customValues) {
      return record;
    }
    const customAttributes = attrLinksStore.attributes(ObjectTypeId.PartUsage);
    Object.keys(partUsage.customValues).forEach((key) => {
      const targetAttribute = customAttributes.find((attr) => attr.number === key);
      if (!targetAttribute) {
        return;
      }
      if (targetAttribute.displayType !== DisplayType.SingleSelect) {
        const currentValue = partUsage.customValues[key];
        record[key as keyof PartUsageChild] = currentValue;
        return;
      }
      // Get single select option
      const currentValue = partUsage.customValues[key];
      const targetOption = targetAttribute.options.find(
        (option) => option.key === currentValue,
      );
      // Display raw value if option is not found
      if (!targetOption) {
        record[key as keyof PartUsageChild] = currentValue;
        return;
      }
      // Get display value of current language
      const display = targetOption.languages[lang];
      if (display) {
        // Display language
        record[key as keyof PartUsageChild] = display;
      } else {
        // Show default value if language display not found
        record[key as keyof PartUsageChild] = targetOption.value;
      }
    });
    return record;
  });
  return newRecords;
};

export const partUsageService = {
  getByParentVersionId,
  toRecords,
};
