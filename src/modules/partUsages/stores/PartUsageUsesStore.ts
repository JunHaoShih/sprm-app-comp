import { defineStore } from 'pinia';
import { QTreeNode, QTreeProps } from 'quasar';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { PartUsageChild } from '../models/PartUsageUses';

interface PartUsageUsesContainer {
  uses: Map<number, Map<number, PartUsageChild>>,
  root: PartVersion,
}

export interface BomTreeNode extends QTreeNode {
  nodeId: number,
  parentId: number,
  versionId: number,
  childId: number,
}

let idCounter = 0;

const getSubTreeNodes = (mapValue: Map<number, PartUsageChild>, wholeMap: Map<number, Map<number, PartUsageChild>>): QTreeProps['nodes'] => {
  const nodes = [] as QTreeNode[];
  mapValue.forEach((value) => {
    const currentNode: BomTreeNode = {
      nodeId: idCounter,
      label: `${value.uses.number} - ${value.uses.version.version}`,
      icon: 'settings',
      parentId: value.usedBy,
      versionId: value.uses.version.id,
      childId: value.id,
      lazy: true,
    };
    idCounter += 1;
    const children = wholeMap.get(value.uses.version.id);
    if (children) {
      currentNode.children = getSubTreeNodes(children, wholeMap);
      currentNode.lazy = false;
    }
    nodes.push(currentNode);
  });
  return nodes;
};

const getTreeNodes = (uses: Map<number, Map<number, PartUsageChild>>, root: PartVersion): QTreeProps['nodes'] => {
  idCounter = 0;
  if (!root.master) {
    return [{
      nodeId: idCounter,
      label: '',
      parentId: 0,
      versionId: 0,
      childId: 0,
      icon: 'settings',
    } as BomTreeNode];
  }
  const rootNode: BomTreeNode = {
    nodeId: idCounter,
    label: `${root.master.number} - ${root.version}`,
    parentId: 0,
    versionId: root.id,
    childId: 0,
    icon: 'settings',
  };
  idCounter += 1;
  if (root.id) {
    const children = uses.get(root.id);
    if (children) {
      rootNode.children = getSubTreeNodes(children, uses);
    }
  }
  return [rootNode];
};

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
      const rootNode = getTreeNodes(state.uses, state.root);
      return rootNode;
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
    getChildren(parentId: number): PartUsageChild[] | null {
      const childrenMap = this.uses.get(parentId);
      if (!childrenMap) {
        return null;
      }
      const children = [] as PartUsageChild[];
      childrenMap.forEach((value) => children.push(value));
      return children;
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
