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
      isDraft: false,
      isLatest: false,
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
    async partVersionInit(versionId: number): Promise<boolean> {
      if (versionId === this.content.id) {
        return true;
      }
      this.content = {
        id: 0,
        version: 0,
        isDraft: false,
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
      if (!targetVersion) {
        return false;
      }
      this.content = targetVersion;
      return true;
    },
  },
});
