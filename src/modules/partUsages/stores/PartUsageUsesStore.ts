import { defineStore } from 'pinia';
import { QTreeProps } from 'quasar';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { PartUsageChild } from '../models/PartUsageUses';
import { BomTreeNode, useBomTreeStore } from './BomTreeStore';

interface PartUsageUsesContainer {
  uses: Map<number, Map<number, PartUsageChild>>,
  root: PartVersion,
}

export const usePartUsageChildrenStore = defineStore('partUsageChildren', {
  state: (): PartUsageUsesContainer => ({
    uses: new Map<number, Map<number, PartUsageChild>>(),
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
    selectedTreeNode: () => (nodeId: number): BomTreeNode | undefined => {
      const treeNodeStore = useBomTreeStore();
      return treeNodeStore.getByNodeId(nodeId);
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
  },
  actions: {
    initialize(usages: PartUsageChild[], partVersion: PartVersion) {
      this.root = partVersion;
      this.uses = new Map<number, Map<number, PartUsageChild>>();
      for (let i = 0; i < usages.length; i += 1) {
        const usage = usages[i];
        if (!this.uses.has(usage.usedBy)) {
          this.uses.set(usage.usedBy, new Map<number, PartUsageChild>());
        }
        if (!this.uses.get(usage.usedBy)?.has(usage.uses.version.id)) {
          this.uses.get(usage.usedBy)?.set(usage.uses.version.id, usage);
        }
      }
      this.root = partVersion;
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
        if (!this.uses.has(usage.usedBy)) {
          this.uses.set(usage.usedBy, new Map<number, PartUsageChild>());
        }
        if (!this.uses.get(usage.usedBy)?.has(usage.uses.version.id)) {
          this.uses.get(usage.usedBy)?.set(usage.uses.version.id, usage);
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
  },
});
