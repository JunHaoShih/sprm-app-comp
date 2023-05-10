import { defineStore } from 'pinia';
import { i18n } from 'src/boot/i18n';
import { AttributeType, AttributeTypeOption } from '../models/CustomAttribute';

export const useAttributeTypesStore = defineStore('attributeTypes', {
  getters: {
    i18nOptions(): AttributeTypeOption[] {
      return [
        { label: i18n.global.t('customs.attributes.types.string'), value: AttributeType.String, attributeNumber: '' },
      ];
    },
  },
  actions: {
    getOption(attrType: AttributeType): AttributeTypeOption {
      const option = this.i18nOptions
        .find((attrOption) => attrOption.value === attrType) as AttributeTypeOption;
      return option;
    },
  },
});
