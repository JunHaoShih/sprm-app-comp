import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { AttributeType, AttributeTypeOption } from '../models/CustomAttribute';

export interface AttributeTypeOptionContainer {
  types: AttributeTypeOption[],
}

export const useAttributeTypesStore = defineStore('attributeTypes', {
  state: (): AttributeTypeOptionContainer => ({
    types: [],
  }),
  getters: {
    i18nOptions(state): AttributeTypeOption[] {
      state.types = [
        { label: useI18n().t('customs.attributes.types.string'), value: AttributeType.String, attributeNumber: '' },
      ];
      return state.types;
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
