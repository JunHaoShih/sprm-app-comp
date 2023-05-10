import { defineStore } from 'pinia';
import { i18n } from 'src/boot/i18n';
import { DisplayType, DisplayTypeOption } from '../models/CustomAttribute';

export const useDisplayTypesStore = defineStore('displayTypes', {
  getters: {
    i18nOptions(): DisplayTypeOption[] {
      return [
        { label: i18n.global.t('customs.attributes.displays.value'), value: DisplayType.Value, attributeNumber: '' },
        { label: i18n.global.t('customs.attributes.displays.singleSelect'), value: DisplayType.SingleSelect, attributeNumber: '' },
      ];
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
