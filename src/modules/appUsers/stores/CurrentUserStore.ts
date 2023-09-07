import { defineStore } from 'pinia';
import { Md5 } from 'ts-md5';
import { api } from 'src/boot/axios';
import { HubConnection } from '@microsoft/signalr';
import { handleGenericError, handleGenericResponse } from 'src/services/AxiosHandlingService';
import { authService } from 'src/modules/authentications/services/AuthenticationService';
import { Crud, Permission } from 'src/modules/permissions/models/Permission';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { signalrInit } from 'src/modules/signalr/services/signalrService';
import { AppUser } from '../models/AppUser';

export interface AppUserContainer {
  appUser: AppUser,
  permissions: Permission[],
  accessToken: string,
  connection?: HubConnection,
}

export const useCurrentUserStore = defineStore('currentUser', {
  state: (): AppUserContainer => ({
    appUser: {
      id: 0,
      username: '00000000000000000000000000000000',
      fullName: '',
      isAdmin: false,
      createUser: '',
      createDate: new Date(),
      updateUser: '',
      updateDate: new Date(),
      customValues: {},
      remarks: '',
    },
    permissions: [],
    accessToken: '',
  }),
  getters: {
    getGravatar(state): string {
      return `https://www.gravatar.com/avatar/${Md5.hashStr(state.appUser.username)}?s=32&d=identicon`;
    },
    hasPermission: (state) => (objType :SprmObjectType, crud :Crud): boolean => {
      // Admin does not need to check
      if (state.appUser.isAdmin) {
        return true;
      }
      const permission = state.permissions.find((p) => p.objectType === objType);
      if (!permission) {
        return false;
      }
      const crudsPermission: Record<Crud, boolean> = {
        create: permission.createPermitted,
        read: permission.readPermitted,
        update: permission.updatePermitted,
        delete: permission.deletePermitted,
      };
      return crudsPermission[crud];
    },
  },
  actions: {
    async login(username: string, password: string): Promise<boolean> {
      const response = await authService.login(username, password);
      if (!response) {
        return false;
      }
      await this.clear();
      this.accessToken = response.token;
      localStorage.setItem('token', response.refreshToken);
      this.connection = signalrInit(this.accessToken);
      this.connection.start();
      return true;
    },

    async tryRefreshAccessToken(refreshToken: string) {
      const authDto = await authService.refreshToken(refreshToken);
      if (!authDto) {
        return false;
      }
      this.connection?.stop();
      this.accessToken = authDto.token;
      this.connection = signalrInit(this.accessToken);
      this.connection.start();
      return true;
    },

    async logout() {
      const token = localStorage.getItem('token');
      localStorage.removeItem('token');
      await this.clear();
      return token;
    },

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

    async clear() {
      this.appUser = {
        id: 0,
        username: '00000000000000000000000000000000',
        fullName: '',
        isAdmin: false,
        createUser: '',
        createDate: new Date(),
        updateUser: '',
        updateDate: new Date(),
        customValues: {},
        remarks: '',
      };
      this.permissions.length = 0;
      this.accessToken = '';
      await this.connection?.stop();
    },
  },
});
