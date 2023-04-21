import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { ViewType, ViewTypeOption } from '../models/Part';

export interface ViewTypeOptionContainer {
  viewTypes: ViewTypeOption[],
}

export const viewTypeOptionsStore = defineStore('viewTypeOptions', {
  state: (): ViewTypeOptionContainer => ({
    viewTypes: [
      { label: useI18n().t('parts.views.design'), value: ViewType.Design, attributeNumber: '' },
      { label: useI18n().t('parts.views.manufacturing'), value: ViewType.Manufacturing, attributeNumber: '' },
    ],
  }),
  getters: {
    i18nOptions(state): ViewTypeOption[] {
      state.viewTypes = [
        { label: useI18n().t('parts.views.design'), value: ViewType.Design, attributeNumber: '' },
        { label: useI18n().t('parts.views.manufacturing'), value: ViewType.Manufacturing, attributeNumber: '' },
      ];
      return state.viewTypes;
    },
  },
});
