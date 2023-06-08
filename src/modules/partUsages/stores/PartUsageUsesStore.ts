import { defineStore } from 'pinia';
import { QTreeProps } from 'quasar';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { Part, PartVersionInfo } from 'src/modules/parts/models/Part';
import { partVersionService } from 'src/modules/parts/services/PartVersionService';
import { PartUsageChild } from '../models/PartUsageUses';
import { BomTreeNode, useBomTreeStore } from './BomTreeStore';

interface PartUsageTreeContainer {
  uses: Map<number, Map<number, PartUsageChild>>,
  partMap: Map<number, Part>,
  versionInfoMap: Map<number, PartVersionInfo>,
  partVersionMap: Map<number, PartVersion>,
  root: PartVersion,
}

export const usePartUsageTreeStore = defineStore('partUsageTree', {
  state: (): PartUsageTreeContainer => ({
    uses: new Map<number, Map<number, PartUsageChild>>(),
    partMap: new Map<number, Part>(),
    versionInfoMap: new Map<number, PartVersionInfo>(),
    partVersionMap: new Map<number, PartVersion>(),
    root: {} as PartVersion,
  }),
  getters: {
    treeNodes: (state) => (isEdit: boolean): QTreeProps['nodes'] => {
      if (!state.root.master) {
        return [{
          label: '',
          icon: 'room_service',
        }];
      }
      const treeNodeStore = useBomTreeStore();
      const rootNode = treeNodeStore.getTreeNodes(state.uses, state.root, state.partMap, isEdit);
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
    initialize(usages: PartUsageChild[], partVersion: PartVersion, isEdit: boolean) {
      this.root = partVersion;
      this.uses.clear();
      this.partVersionMap.clear();
      this.partMap.clear();
      for (let i = 0; i < usages.length; i += 1) {
        const usage = usages[i];
        if (!this.uses.has(usage.parentId)) {
          this.uses.set(usage.parentId, new Map<number, PartUsageChild>());
        }
        this.uses.get(usage.parentId)?.set(usage.child.version.id, usage);
        this.partMap.set(usage.child.id, usage.child);
      }
      return this.treeNodes(isEdit);
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
        this.uses.get(usage.parentId)?.set(usage.child.version.id, usage);
        this.partMap.set(usage.child.id, usage.child);
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
    updateUsage(parentId: number, childId: number, updatedUsage: PartUsageChild) {
      if (this.uses.has(parentId)) {
        if (this.uses.get(parentId)?.has(childId)) {
          this.uses.get(parentId)?.set(childId, updatedUsage);
          this.partMap.set(updatedUsage.child.id, updatedUsage.child);
        }
      }
    },
    setPart(part: Part) {
      this.partMap.set(part.id, part);
    },
  },
});
