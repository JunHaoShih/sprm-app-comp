import { defineStore } from 'pinia';
import { QTreeNode, QTreeProps } from 'quasar';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { PartUsageChild } from '../models/PartUsageUses';

export interface BomTreeNode extends QTreeNode {
  parentId: number,
  versionId: number,
  usageId: number,
}

interface BomTreeContainer {
  nodeMap: Map<number, BomTreeNode>,
}

export const useBomTreeStore = defineStore('bomTreeStore', {
  state: (): BomTreeContainer => ({
    nodeMap: new Map<number, BomTreeNode>(),
  }),
  getters: {
    getByNodeId: (state) => (usageId: number): BomTreeNode | undefined => (
      state.nodeMap.get(usageId)
    ),
  },
  actions: {
    getSubTreeNodes(mapValue: Map<number, PartUsageChild>, wholeMap: Map<number, Map<number, PartUsageChild>>): QTreeProps['nodes'] {
      const nodes = [] as QTreeNode[];
      mapValue.forEach((value) => {
        const currentNode: BomTreeNode = {
          label: `${value.uses.number} - ${value.uses.version.version}`,
          icon: 'settings',
          parentId: value.usedBy,
          versionId: value.uses.version.id,
          usageId: value.id,
          lazy: true,
        };
        this.nodeMap.set(value.id, currentNode);
        const children = wholeMap.get(value.uses.version.id);
        if (children) {
          currentNode.children = this.getSubTreeNodes(children, wholeMap);
          currentNode.lazy = false;
        }
        nodes.push(currentNode);
      });
      return nodes;
    },
    getTreeNodes(uses: Map<number, Map<number, PartUsageChild>>, root: PartVersion): QTreeProps['nodes'] {
      this.nodeMap.clear();
      if (!root.master) {
        const dummyNode: BomTreeNode = {
          label: '',
          parentId: 0,
          versionId: 0,
          usageId: 0,
          icon: 'settings',
        };
        this.nodeMap.set(0, dummyNode);
        return [dummyNode];
      }
      const rootNode: BomTreeNode = {
        label: `${root.master.number} - ${root.version}`,
        parentId: 0,
        versionId: root.id,
        usageId: 0,
        icon: 'settings',
      };
      this.nodeMap.set(0, rootNode);
      if (root.id) {
        const children = uses.get(root.id);
        if (children) {
          rootNode.children = this.getSubTreeNodes(children, uses);
        }
      }
      return [rootNode];
    },
  },
});
