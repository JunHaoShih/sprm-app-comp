import { defineStore } from 'pinia';
import { QTreeNode, QTreeProps } from 'quasar';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { PartUsageChild } from '../models/PartUsageUses';

export interface BomTreeNode extends QTreeNode {
  nodeId: number,
  parentId: number,
  versionId: number,
  childId: number,
}

interface BomTreeContainer {
  nodeMap: Map<number, BomTreeNode>,
  idCounter: number,
}

export const useBomTreeStore = defineStore('bomTreeStore', {
  state: (): BomTreeContainer => ({
    nodeMap: new Map<number, BomTreeNode>(),
    idCounter: 0,
  }),
  getters: {
    getByNodeId: (state) => (nodeId: number): BomTreeNode | undefined => (
      state.nodeMap.get(nodeId)
    ),
  },
  actions: {
    getSubTreeNodes(mapValue: Map<number, PartUsageChild>, wholeMap: Map<number, Map<number, PartUsageChild>>): QTreeProps['nodes'] {
      const nodes = [] as QTreeNode[];
      mapValue.forEach((value) => {
        const currentNode: BomTreeNode = {
          nodeId: this.idCounter,
          label: `${value.uses.number} - ${value.uses.version.version}`,
          icon: 'settings',
          parentId: value.usedBy,
          versionId: value.uses.version.id,
          childId: value.id,
          lazy: true,
        };
        this.nodeMap.set(this.idCounter, currentNode);
        this.idCounter += 1;
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
      this.idCounter = 0;
      this.nodeMap.clear();
      if (!root.master) {
        const dummyNode: BomTreeNode = {
          nodeId: this.idCounter,
          label: '',
          parentId: 0,
          versionId: 0,
          childId: 0,
          icon: 'settings',
        };
        this.nodeMap.set(this.idCounter, dummyNode);
        return [dummyNode];
      }
      const rootNode: BomTreeNode = {
        nodeId: this.idCounter,
        label: `${root.master.number} - ${root.version}`,
        parentId: 0,
        versionId: root.id,
        childId: 0,
        icon: 'settings',
      };
      this.nodeMap.set(this.idCounter, rootNode);
      this.idCounter += 1;
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
