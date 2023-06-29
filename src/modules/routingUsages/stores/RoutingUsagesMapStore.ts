import { defineStore } from 'pinia';
import { QTreeNode, QTreeProps } from 'quasar';
import { RoutingUsage } from '../models/RoutingUsage';

export interface RoutingUsageTreeNode extends QTreeNode {
  parentUsageId: number | null,
  rootVersionId: number,
  number: string,
  usageId: number,
  processId: number,
  processNumber: string,
  processName: string,
}

interface RoutingUsagesTreeContainer {
  nodeMap: Map<number, RoutingUsageTreeNode>,
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
      const nodes: RoutingUsageTreeNode[] = [];
      const childrenMap = usageMap.get(parentUsageId);
      if (childrenMap) {
        childrenMap.forEach((value: RoutingUsage) => {
          const rootNode: RoutingUsageTreeNode = {
            label: `${value.number} - ${value.processNumber}`,
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
    getByNodeId(usageId: number): RoutingUsageTreeNode | undefined {
      return this.nodeMap.get(usageId);
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
    treeNodes: (state): QTreeProps['nodes'] => {
      if (state.usageMap.size === 0) {
        return [{
          label: '',
          icon: 'room_service',
        }];
      }
      const treeNodesStore = useRoutingUsagesTreeStore();
      return treeNodesStore.getTreeNode(state.usageMap, null);
    },
    selectedTreeNode: () => (usageId: number): RoutingUsageTreeNode | undefined => {
      const treeNodesStore = useRoutingUsagesTreeStore();
      return treeNodesStore.getByNodeId(usageId);
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
  },
});
