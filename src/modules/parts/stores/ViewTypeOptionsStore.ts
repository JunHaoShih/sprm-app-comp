import { defineStore } from 'pinia';
import { i18n } from 'src/boot/i18n';
import { ViewType, ViewTypeOption } from '../models/Part';

export const useViewTypeOptionsStore = defineStore('viewTypeOptions', {
  getters: {
    i18nOptions(): ViewTypeOption[] {
      return [
        { label: i18n.global.t('parts.views.design'), value: ViewType.Design, attributeNumber: '' },
        { label: i18n.global.t('parts.views.manufacturing'), value: ViewType.Manufacturing, attributeNumber: '' },
      ];
    },
  },
  actions: {},
});
