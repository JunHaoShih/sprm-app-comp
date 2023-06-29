<template>
  <div>
    <slot name="before"></slot>
    <q-tree
      ref="qtree"
      :nodes="routingUsagesMapStore.treeNodes"
      v-model:selected="selectedUsageId"
      selected-color="primary"
      node-key="usageId"
      :default-expand-all="true"
      no-selection-unset
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <q-icon :name="prop.node.icon" class="q-mr-sm"></q-icon>
          <div>{{ prop.node.label }}</div>
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, onUpdated, ref, watch,
} from 'vue';
import { QTree } from 'quasar';
import 'src/extensions/date.extensions';
import { routingUsageService } from '../services/RoutingUsageService';
import { RoutingUsageTreeNode, useRoutingUsagesMapStore } from '../stores/RoutingUsagesMapStore';

const routingUsagesMapStore = useRoutingUsagesMapStore();

const qtree = ref<QTree>();

const selectedUsageId = ref(0);

const props = withDefaults(defineProps<{
  id: number,
  selectedNode: RoutingUsageTreeNode,
}>(), {
});

type Emit = {
  (e: 'update:selectedNode', value: RoutingUsageTreeNode): void,
}
const emit = defineEmits<Emit>();

const selectedNode = computed({
  get: () => props.selectedNode,
  set: (value) => emit('update:selectedNode', value),
});

async function initializePage(routingVersionId: number) {
  const uses = await routingUsageService.getByRootVersionId(routingVersionId);
  if (uses) {
    // await partVersionStore.partVersionInit(partVersionId);
    routingUsagesMapStore.initialize(uses);
  }
}

watch(() => props.id, async () => {
  await initializePage(props.id);
});

watch(() => selectedUsageId.value, async () => {
  const node = routingUsagesMapStore.selectedTreeNode(selectedUsageId.value);
  if (node) {
    selectedNode.value = node;
  }
});

onBeforeMount(async () => {
  await initializePage(props.id);
});

onUpdated(() => {
  qtree.value?.expandAll();
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 190px)
</style>
