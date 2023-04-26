<template>
  <div class="q-pa-sm">
    <!-- splitter area -->
    <q-splitter
      v-model="splitterModel"
      class="outer-max"
    >
      <template v-slot:before>
        <div class="q-pa-md q-gutter-sm">
          <q-tree
          ref="qtree"
            :nodes="partUsaeChildrenStore.treeNodes"
            v-model:selected="selectedUsageId"
            selected-color="primary"
            node-key="usageId"
            @lazy-load="onLazyLoad"
            @update:selected="onSelected"
            :default-expand-all="true"
          />
        </div>
      </template>

      <template v-slot:after>
        <div class="q-gutter-sm">
          <PartUsageRightPanel
            :id="selectedParentId"
            :readonly="true"
          />
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useQuasar } from 'quasar';
import PartUsageRightPanel from './PartUsageRightPanel.vue';
import { usePartVersionStore } from '../parts/stores/PartVersionStore';
import { usePartUsageChildrenStore } from './stores/PartUsageUsesStore';
import { partUsageService } from './services/PartUsageService';
import 'src/extensions/date.extensions';
import { BomTreeNode } from './stores/BomTreeStore';

const $q = useQuasar();

const partVersionStore = usePartVersionStore();

const partUsaeChildrenStore = usePartUsageChildrenStore();

const splitterModel = ref(50);

const selectedUsageId = ref(0);

const previousSelectedUsageId = ref(0);

const selectedParentId = computed(
  (): number => {
    const node = partUsaeChildrenStore.selectedTreeNode(selectedUsageId.value);
    if (!node) {
      return 0;
    }
    return node.versionId;
  },
);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function updateChildrenStore(parentId: number) {
  $q.loading.show({
    delay: 400,
  });
  const uses = await partUsageService.getByParentVersionId(parentId);
  if (uses) {
    partUsaeChildrenStore.addUses(uses, parentId);
  }
  $q.loading.hide();
}

async function onLazyLoad(details: {
  node: BomTreeNode,
  key: string,
  done: (children?: readonly BomTreeNode[] | undefined) => void,
  fail: () => void,
}) {
  const exist = partUsaeChildrenStore.children(details.node.versionId);
  if (exist) {
    details.done([]);
    return;
  }
  await updateChildrenStore(details.node.versionId);
  details.done([]);
}

async function onSelected(nodeId: number) {
  if (!nodeId && nodeId !== 0) {
    selectedUsageId.value = previousSelectedUsageId.value;
    return;
  }
  previousSelectedUsageId.value = nodeId;
  const targetNode = partUsaeChildrenStore.selectedTreeNode(nodeId);
  if (!targetNode) {
    return;
  }
  const exist = partUsaeChildrenStore.children(targetNode.versionId);
  if (exist) {
    return;
  }
  await updateChildrenStore(targetNode.versionId);
}

async function initializePage(partVersionId: number) {
  const uses = await partUsageService.getByParentVersionId(partVersionId);
  if (uses) {
    await partVersionStore.partVersionInit(partVersionId);
    partUsaeChildrenStore.initialize(uses, partVersionStore.partVersion);
    selectedUsageId.value = 0;
    previousSelectedUsageId.value = 0;
  }
}

watch(() => props.id, async (newValue) => {
  await initializePage(Number(newValue));
});

onBeforeMount(async () => {
  await initializePage(Number(props.id));
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 190px)
</style>
