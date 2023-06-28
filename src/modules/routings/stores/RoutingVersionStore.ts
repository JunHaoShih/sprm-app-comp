import { defineStore } from 'pinia';
import { RoutingMasterInfo, RoutingVersion } from '../models/RoutingVersion';
import { routingVersionService } from '../services/RoutingVersionService';

export interface RoutingVersionContainer {
  content: RoutingVersion
}

export const useRoutingVersionStore = defineStore('routingVersion', {
  state: (): RoutingVersionContainer => ({
    content: {
      id: 0,
      createUser: '',
      createDate: new Date(),
      updateUser: '',
      updateDate: new Date(),
      remarks: '',
      master: {} as RoutingMasterInfo,
      version: 0,
      isDraft: false,
      isLatest: false,
      customValues: {},
    },
  }),
  actions: {
    async routingVersionInit(versionId: number): Promise<boolean> {
      if (versionId === this.content.id) {
        return true;
      }
      this.content = {
        id: 0,
        createUser: '',
        createDate: new Date(),
        updateUser: '',
        updateDate: new Date(),
        remarks: '',
        master: {} as RoutingMasterInfo,
        version: 0,
        isDraft: false,
        isLatest: false,
        customValues: {},
      };
      const targetVersion = await routingVersionService.getById(versionId);
      if (!targetVersion) {
        return false;
      }
      this.content = targetVersion;
      return true;
    },
  },
});
