import { defineStore } from 'pinia';
import { QTreeProps } from 'quasar';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { partVersionService } from 'src/modules/parts/services/PartVersionService';
import { PartUsageChild } from '../models/PartUsageUses';
import { BomTreeNode, useBomTreeStore } from './BomTreeStore';

interface PartUsageUsesContainer {
  uses: Map<number, Map<number, PartUsageChild>>,
  partVersionMap: Map<number, PartVersion>,
  root: PartVersion,
}

export const usePartUsageChildrenStore = defineStore('partUsageChildren', {
  state: (): PartUsageUsesContainer => ({
    uses: new Map<number, Map<number, PartUsageChild>>(),
    partVersionMap: new Map<number, PartVersion>(),
    root: {} as PartVersion,
  }),
  getters: {
    treeNodes: (state): QTreeProps['nodes'] => {
      if (!state.root.master) {
        return [{
          label: '',
          icon: 'room_service',
        }];
      }
      const treeNodeStore = useBomTreeStore();
      const rootNode = treeNodeStore.getTreeNodes(state.uses, state.root);
      return rootNode;
    },
    selectedTreeNode: () => (usageId: number): BomTreeNode | undefined => {
      const treeNodeStore = useBomTreeStore();
      return treeNodeStore.getByNodeId(usageId);
    },
    children: (state) => (parentId: number): PartUsageChild[] | null => {
      const childrenMap = state.uses.get(parentId);
      if (!childrenMap) {
        return null;
      }
      const children = [] as PartUsageChild[];
      childrenMap.forEach((value) => children.push(value));
      return children;
    },
    partVersion: (state) => (
      (versionId: number): PartVersion | undefined => state.partVersionMap.get(versionId)
    ),
  },
  actions: {
    initialize(usages: PartUsageChild[], partVersion: PartVersion) {
      this.root = partVersion;
      this.uses.clear();
      this.partVersionMap.clear();
      for (let i = 0; i < usages.length; i += 1) {
        const usage = usages[i];
        if (!this.uses.has(usage.parentId)) {
          this.uses.set(usage.parentId, new Map<number, PartUsageChild>());
        }
        if (!this.uses.get(usage.parentId)?.has(usage.child.version.id)) {
          this.uses.get(usage.parentId)?.set(usage.child.version.id, usage);
        }
      }
      return this.treeNodes;
    },
    addUses(usages: PartUsageChild[], parentId: number) {
      if (usages.length === 0) {
        if (!this.uses.has(parentId)) {
          this.uses.set(parentId, new Map<number, PartUsageChild>());
        }
        return;
      }
      for (let i = 0; i < usages.length; i += 1) {
        const usage = usages[i];
        if (!this.uses.has(usage.parentId)) {
          this.uses.set(usage.parentId, new Map<number, PartUsageChild>());
        }
        if (!this.uses.get(usage.parentId)?.has(usage.child.version.id)) {
          this.uses.get(usage.parentId)?.set(usage.child.version.id, usage);
        }
      }
    },
    deleteUses(parentId: number, childId: number) {
      if (this.uses.has(parentId)) {
        if (this.uses.get(parentId)?.has(childId)) {
          this.uses.get(parentId)?.delete(childId);
        }
      }
    },
    async partVersionInit(versionId: number) {
      const storedVersion = this.partVersionMap.get(versionId);
      if (storedVersion) {
        return;
      }
      const targetVersion = await partVersionService.getById(versionId);
      if (targetVersion) {
        this.partVersionMap.set(versionId, targetVersion);
      }
    },
  },
});
