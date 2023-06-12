import { defineStore } from 'pinia';
import { Md5 } from 'ts-md5';
import { api } from 'src/boot/axios';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { Notify } from 'quasar';
import { AppUser } from '../models/AppUser';

export const CurrentUserStore = defineStore('currentUser', {
  state: (): AppUser => ({
    id: 0,
    username: '00000000000000000000000000000000',
    fullName: '',
  }),
  getters: {
    getGravatar(state): string {
      return `https://www.gravatar.com/avatar/${Md5.hashStr(state.username)}?s=32&d=identicon`;
    },
  },
  actions: {
    async getCurrentUser(): Promise<AppUser | null> {
      const appUser = await api.get('/api/AppUser/Me')
        .then((response) => {
          const data = response.data as SPRMResponse<AppUser>;
          return data.content;
        })
        .catch((error) => {
          let message = '';
          if (error.response) {
            const body: SPRMResponse<string> = error.response.data;
            message = `Error: ${body.code}, ${body.message}`;
          } else if (error.request) {
            // The request was made but no response was received
            message = 'Error: No response';
          } else {
            // Something happened in setting up the request that triggered an Error
            message = 'Something went wrong';
          }
          Notify.create({
            message,
            color: 'red',
            icon: 'error',
          });
          return null;
        });
      if (appUser) {
        this.$state = appUser;
      }
      return appUser;
    },
  },
});
