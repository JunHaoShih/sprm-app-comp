import { defineStore } from 'pinia';
import { QTreeNode, QTreeProps } from 'quasar';
import { Part } from 'src/modules/parts/models/Part';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { PartUsageChild } from '../models/PartUsageUses';

export interface BomTreeNode extends QTreeNode {
  parentId: number,
  versionId: number,
  checkout: boolean,
  usageId: number,
}

interface BomTreeContainer {
  nodeMap: Map<number, BomTreeNode>,
}

const getPartLabel = (part: Part) => {
  const checkoutState = part.checkout ? '(*) ' : '';
  return `${checkoutState}${part.number} - ${part.version.version}`;
};

const getPartVersionLabel = (partVersion: PartVersion) => {
  const checkoutState = partVersion.master.checkout ? '(*) ' : '';
  return `${checkoutState}${partVersion.master.number} - ${partVersion.version}`;
};

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
          label: getPartLabel(value.child),
          icon: 'settings',
          parentId: value.parentId,
          versionId: value.child.version.id,
          checkout: value.child.checkout,
          usageId: value.id,
          lazy: true,
        };
        this.nodeMap.set(value.id, currentNode);
        const children = wholeMap.get(value.child.version.id);
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
          checkout: false,
          usageId: 0,
          icon: 'settings',
        };
        this.nodeMap.set(0, dummyNode);
        return [dummyNode];
      }
      const rootNode: BomTreeNode = {
        label: getPartVersionLabel(root),
        parentId: 0,
        versionId: root.id,
        checkout: root.master.checkout,
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
