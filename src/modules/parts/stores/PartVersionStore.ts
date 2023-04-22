import { defineStore } from 'pinia';
import { PartVersion } from '../models/PartVersion';
import { ViewType } from '../models/Part';

interface PartVersionContainer {
  content: PartVersion
}

export const usePartVersionStore = defineStore('partVersion', {
  state: (): PartVersionContainer => ({
    content: {
      id: 0,
      version: 0,
      checkout: false,
      master: {
        id: 0,
        number: '',
        name: '',
        viewType: ViewType.Design,
        checkout: false,
      },
      customValues: {} as Record<string, string>,
      createUser: '',
      createDate: new Date(),
      updateUser: '',
      updateDate: new Date(),
      remarks: '',
    },
  }),
  actions: {
    setPartVersion(partVersion: PartVersion): void {
      this.content = partVersion;
    },
  },
});
