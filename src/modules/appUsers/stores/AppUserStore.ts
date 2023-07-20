import { defineStore } from 'pinia';
import { AppUser } from '../models/AppUser';

export interface AppUserContainer {
  appUser: AppUser,
}

export const useUserStore = defineStore('appUser', {
  state: (): AppUserContainer => ({
    appUser: {
      id: 0,
      username: '',
      fullName: '',
      isAdmin: false,
      customValues: {},
      createUser: '',
      createDate: new Date(),
      updateUser: '',
      updateDate: new Date(),
      remarks: '',
    },
  }),
});
