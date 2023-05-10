import { defineStore } from 'pinia';
import { PartVersion } from '../models/PartVersion';
import { ViewType } from '../models/Part';
import { partVersionService } from '../services/PartVersionService';

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
  getters: {
    partVersion: (state): PartVersion => state.content,
  },
  actions: {
    async partVersionInit(versionId: number): Promise<void> {
      this.content = {
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
      } as PartVersion;
      const targetVersion = await partVersionService.getById(versionId);
      if (targetVersion) {
        this.content = targetVersion;
      }
    },
  },
});
