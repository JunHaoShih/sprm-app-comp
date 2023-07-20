import { defineStore } from 'pinia';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { customValueRecordService } from 'src/services/CustomValueRecordService';
import { i18n } from 'src/boot/i18n';
import { AppUser } from '../models/AppUser';

export interface AppUsersContainer {
  appUsers: AppUser[],
}

export const useUsersStore = defineStore('users', {
  state: (): AppUsersContainer => ({
    appUsers: [],
  }),
  getters: {
    records: (state): Record<string, unknown>[] => {
      const attrLinksStore = useAttributeLinksStore();
      const lang = i18n.global.locale.value;
      const newRecords = state.appUsers.map((user) => {
        const record: Record<string, unknown> = user;
        if (!user.customValues) {
          return record;
        }
        const customAttributes = attrLinksStore.attributes(SprmObjectType.AppUser);
        const newRecord = customValueRecordService
          .toRecord(record, customAttributes, user.customValues, lang);
        return newRecord;
      });
      return newRecords;
    },
  },
  actions: {
    addAppUser(appUser: AppUser): void {
      this.appUsers.push(appUser);
    },
    unshiftAppUser(appUser: AppUser): void {
      this.appUsers.unshift(appUser);
    },
    updateAppUser(appUser: AppUser): void {
      const index = this.appUsers.findIndex((currentUser) => currentUser.id === appUser.id);
      this.appUsers[index] = appUser;
    },
    removeAppUser(appUser: AppUser): void {
      const index = this.appUsers.findIndex((currentUser) => currentUser.id === appUser.id);
      if (index >= 0) {
        this.appUsers.splice(index, 1);
      }
    },
  },
});
