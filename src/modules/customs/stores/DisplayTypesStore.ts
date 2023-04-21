import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { DisplayType, DisplayTypeOption } from '../models/CustomAttribute';

export interface DisplayTypeOptionContainer {
  types: DisplayTypeOption[],
}

export const useDisplayTypesStore = defineStore('displayTypes', {
  state: (): DisplayTypeOptionContainer => ({
    types: [],
  }),
  getters: {
    i18nOptions(state): DisplayTypeOption[] {
      state.types = [
        { label: useI18n().t('customs.attributes.displays.value'), value: DisplayType.Value, attributeNumber: '' },
        { label: useI18n().t('customs.attributes.displays.singleSelect'), value: DisplayType.SingleSelect, attributeNumber: '' },
      ];
      return state.types;
    },
  },
  actions: {
    getOption(attrType: DisplayType): DisplayTypeOption {
      const option = this.i18nOptions
        .find((attrOption) => attrOption.value === attrType) as DisplayTypeOption;
      return option;
    },
  },
});
