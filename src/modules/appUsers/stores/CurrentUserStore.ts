import { defineStore } from 'pinia';
import { Md5 } from 'ts-md5';
import { api } from 'src/boot/axios';
import { handleGenericError, handleGenericResponse } from 'src/services/AxiosHandlingService';
import { Permission } from 'src/modules/permissions/models/Permission';
import { AppUser } from '../models/AppUser';

export interface AppUserContainer {
  appUser: AppUser,
  permissions: Permission[],
}

export const useCurrentUserStore = defineStore('currentUser', {
  state: (): AppUserContainer => ({
    appUser: {
      id: 0,
      username: '00000000000000000000000000000000',
      fullName: '',
      isAdmin: false,
    },
    permissions: [],
  }),
  getters: {
    getGravatar(state): string {
      return `https://www.gravatar.com/avatar/${Md5.hashStr(state.appUser.username)}?s=32&d=identicon`;
    },
  },
  actions: {
    async getCurrentUser(): Promise<AppUser | null> {
      const appUser = await api.get('/api/AppUser/Me')
        .then(handleGenericResponse<AppUser>)
        .catch(handleGenericError);
      if (appUser) {
        this.appUser = appUser;
      }
      return appUser;
    },
    async getCurrentPermissions(): Promise<Permission[] | null> {
      const permissions = await api.get('/api/AppUser/Me/Permission')
        .then(handleGenericResponse<Permission[]>)
        .catch(handleGenericError);
      if (permissions) {
        this.permissions = permissions;
      }
      return permissions;
    },
  },
});
