<template>
  <div>
    <slot name="before"></slot>
    <q-tree
      ref="qtree"
      :nodes="partUsaeChildrenStore.treeNodes(props.isEdit)"
      v-model:selected="selectedUsageId"
      selected-color="primary"
      node-key="usageId"
      @lazy-load="onLazyLoad"
      @update:selected="onSelected"
      :default-expand-all="true"
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <q-icon :name="prop.node.icon" class="q-mr-sm"></q-icon>
          <q-badge
            v-if="(prop.node as BomTreeNode).checkout"
            color="orange"
            class="q-mr-sm"
          >
            {{ $t('actions.checkout') }}
          </q-badge>
          <div>{{ prop.node.label }}</div>
        </div>
        <slot name="default-header" :node="(prop.node as BomTreeNode)"></slot>
      </template>
    </q-tree>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useQuasar } from 'quasar';
import 'src/extensions/date.extensions';
import { usePartVersionStore } from 'src/modules/parts/stores/PartVersionStore';
import { usePartUsageTreeStore } from '../stores/PartUsageUsesStore';
import { partUsageService } from '../services/PartUsageService';
import { BomTreeNode } from '../stores/BomTreeStore';

const $q = useQuasar();

const partVersionStore = usePartVersionStore();

const partUsaeChildrenStore = usePartUsageTreeStore();

const selectedUsageId = ref(0);

const props = withDefaults(defineProps<{
  id: number,
  selectedNode: BomTreeNode,
  isEdit: boolean,
}>(), {
});

type Emit = {
  (e: 'update:selectedNode', value: BomTreeNode): void,
}
const emit = defineEmits<Emit>();

const selectedNode = computed({
  get: () => props.selectedNode,
  set: (value) => emit('update:selectedNode', value),
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
    partUsaeChildrenStore.initialize(uses, partVersionStore.partVersion, props.isEdit);
    selectedUsageId.value = 0;
    const node = partUsaeChildrenStore.selectedTreeNode(selectedUsageId.value);
    if (node) {
      selectedNode.value = node;
    }
  }
}

watch(() => props.id, async () => {
  await initializePage(props.id);
});

watch(() => selectedUsageId.value, async () => {
  const node = partUsaeChildrenStore.selectedTreeNode(selectedUsageId.value);
  if (node) {
    selectedNode.value = node;
  }
});

onBeforeMount(async () => {
  await initializePage(props.id);
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 190px)
</style>
