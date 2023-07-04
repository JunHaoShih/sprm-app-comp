import { defineStore } from 'pinia';
import { QTreeNode } from 'quasar';
import { RoutingUsage } from '../models/RoutingUsage';

export interface RoutingUsageTreeNode extends QTreeNode {
  parentUsageId: number | null,
  rootVersionId: number,
  number: string,
  usageId: number | null,
  processId: number,
  processNumber: string,
  processName: string,
}

interface RoutingUsagesTreeContainer {
  nodeMap: Map<number, RoutingUsageTreeNode>,
  rootNode?: RoutingUsageTreeNode,
}

const useRoutingUsagesTreeStore = defineStore('routingUsagesTree', {
  state: (): RoutingUsagesTreeContainer => ({
    nodeMap: new Map<number, RoutingUsageTreeNode>(),
  }),
  actions: {
    getTreeNode(
      usageMap: Map<number | null, Map<number, RoutingUsage>>,
      parentUsageId: number| null,
    ): RoutingUsageTreeNode[] {
      if (!parentUsageId) {
        this.nodeMap.clear();
      }
      const nodes: RoutingUsageTreeNode[] = [];
      const childrenMap = usageMap.get(parentUsageId);
      if (childrenMap) {
        childrenMap.forEach((value: RoutingUsage) => {
          const rootNode: RoutingUsageTreeNode = {
            label: `${value.processNumber}`,
            icon: 'arrow_forward',
            parentUsageId: value.parentUsageId,
            rootVersionId: value.rootVersionId,
            number: value.number,
            usageId: value.id,
            processId: value.processId,
            processNumber: value.processNumber,
            processName: value.processName,
          };
          rootNode.children = this.getTreeNode(usageMap, rootNode.usageId);
          nodes.push(rootNode);
          this.nodeMap.set(value.id, rootNode);
        });
      }
      return nodes.sort((node1, node2) => {
        if (node1.number < node2.number) {
          return -1;
        }
        if (node1.number > node2.number) {
          return 1;
        }
        return 0;
      });
    },
    getByNodeId(usageId: number | null): RoutingUsageTreeNode | undefined {
      return usageId ? this.nodeMap.get(usageId) : this.rootNode;
    },
    getNextNumber() {
      const length = (this.nodeMap.size + 1) * 10;
      return length.toString().padStart(4, '0');
    },
  },
});

interface RoutingUsagesMapContainer {
  usageMap: Map<number | null, Map<number, RoutingUsage>>,
}

export const useRoutingUsagesMapStore = defineStore('routingUsagesMap', {
  state: (): RoutingUsagesMapContainer => ({
    usageMap: new Map<number, Map<number, RoutingUsage>>(),
  }),
  getters: {
    treeNodes: (state): RoutingUsageTreeNode[] => {
      const treeNodesStore = useRoutingUsagesTreeStore();
      treeNodesStore.rootNode = {
        label: 'root',
        icon: 'route',
        parentUsageId: null,
        rootVersionId: 0,
        number: '',
        usageId: null,
        processId: 0,
        processNumber: '',
        processName: '',
      };
      treeNodesStore.rootNode.children = treeNodesStore.getTreeNode(state.usageMap, null);
      return [treeNodesStore.rootNode];
    },
    nextNumber: () => {
      const treeNodesStore = useRoutingUsagesTreeStore();
      return treeNodesStore.getNextNumber();
    },
    selectedTreeNode: () => (usageId: number | null): RoutingUsageTreeNode | undefined => {
      const treeNodesStore = useRoutingUsagesTreeStore();
      return treeNodesStore.getByNodeId(usageId);
    },
    children: (state) => (parentUsageId: number | null): RoutingUsage[] | null => {
      const childrenMap = state.usageMap.get(parentUsageId);
      if (!childrenMap) {
        return null;
      }
      const children = [] as RoutingUsage[];
      childrenMap.forEach((value) => children.push(value));
      return children;
    },
  },
  actions: {
    initialize(usages: RoutingUsage[]) {
      this.usageMap.clear();
      for (let i = 0; i < usages.length; i += 1) {
        const usage = usages[i];
        if (!this.usageMap.has(usage.parentUsageId)) {
          this.usageMap.set(usage.parentUsageId, new Map<number, RoutingUsage>());
        }
        this.usageMap.get(usage.parentUsageId)?.set(usage.id, usage);
      }
    },
    addUses(usages: RoutingUsage[]) {
      for (let i = 0; i < usages.length; i += 1) {
        const usage = usages[i];
        if (!this.usageMap.has(usage.parentUsageId)) {
          this.usageMap.set(usage.parentUsageId, new Map<number, RoutingUsage>());
        }
        this.usageMap.get(usage.parentUsageId)?.set(usage.id, usage);
      }
    },
    deleteUses(parentUsageId: number | null, usageId: number) {
      if (this.usageMap.has(parentUsageId)) {
        if (this.usageMap.get(parentUsageId)?.has(usageId)) {
          this.usageMap.get(parentUsageId)?.delete(usageId);
        }
      }
    },
    updateUsage(updatedUsage: RoutingUsage) {
      if (this.usageMap.has(updatedUsage.parentUsageId)) {
        if (this.usageMap.get(updatedUsage.parentUsageId)?.has(updatedUsage.id)) {
          this.usageMap.get(updatedUsage.parentUsageId)?.set(updatedUsage.id, updatedUsage);
        }
      }
    },
  },
});
