import { defineStore } from 'pinia';
import { QTreeNode, QTreeProps } from 'quasar';
import { Part } from 'src/modules/parts/models/Part';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { PartUsageChild } from '../models/PartUsageUses';

export interface BomTreeNode extends QTreeNode {
  parentId: number,
  childId: number,
  versionId: number,
  checkout: boolean,
  usageId: number,
  infoId: number,
  checkoutId?: number | null,
}

interface BomTreeContainer {
  nodeMap: Map<number, BomTreeNode>,
}

const getPartLabel = (part: Part) => (
  `${part.number} - ${part.version.version}`
);

const getPartVersionLabel = (partVersion: PartVersion) => (
  `${partVersion.master.number} - ${partVersion.version}`
);

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
    getSubTreeNodes(
      mapValue: Map<number, PartUsageChild>,
      wholeMap: Map<number,
      Map<number, PartUsageChild>>,
      partMap: Map<number, Part>,
      isEdit: boolean,
    ): QTreeProps['nodes'] {
      const nodes = [] as QTreeNode[];
      mapValue.forEach((value) => {
        const part = partMap.get(value.child.id);
        if (!part) {
          return;
        }
        const versionId = isEdit && part.draftId ? part.draftId : part.version.id;
        const currentNode: BomTreeNode = {
          label: getPartLabel(part),
          icon: 'settings',
          parentId: value.parentId,
          childId: value.child.id,
          versionId,
          checkout: part.checkout,
          usageId: value.id,
          infoId: part.version.id,
          checkoutId: part.draftId,
          lazy: value.subChildCount > 0,
        };
        this.nodeMap.set(value.id, currentNode);
        const children = wholeMap.get(currentNode.versionId);
        if (children) {
          currentNode.children = this.getSubTreeNodes(children, wholeMap, partMap, isEdit);
          currentNode.lazy = false;
        }
        nodes.push(currentNode);
      });
      return nodes;
    },
    getTreeNodes(uses: Map<number, Map<number, PartUsageChild>>, root: PartVersion, partMap: Map<number, Part>, isEdit: boolean): QTreeProps['nodes'] {
      this.nodeMap.clear();
      if (!root.master) {
        const dummyNode: BomTreeNode = {
          label: '',
          parentId: 0,
          childId: 0,
          versionId: 0,
          checkout: false,
          usageId: 0,
          infoId: 0,
          checkoutId: 0,
          icon: 'settings',
        };
        this.nodeMap.set(0, dummyNode);
        return [dummyNode];
      }
      const rootNode: BomTreeNode = {
        label: getPartVersionLabel(root),
        parentId: 0,
        childId: 0,
        versionId: root.id,
        checkout: root.master.checkout,
        usageId: 0,
        infoId: root.id,
        checkoutId: 0,
        icon: 'settings',
      };
      this.nodeMap.set(0, rootNode);
      if (root.id) {
        const children = uses.get(root.id);
        if (children) {
          rootNode.children = this.getSubTreeNodes(children, uses, partMap, isEdit);
        }
      }
      return [rootNode];
    },
  },
});
