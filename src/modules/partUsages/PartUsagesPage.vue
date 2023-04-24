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
            v-model:selected="selected"
            selected-color="primary"
            node-key="versionId"
            @lazy-load="onLazyLoad"
            :default-expand-all="true"
          />
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <PartUsageRightPanel />
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import PartUsageRightPanel from './PartUsageRightPanel.vue';
import { usePartVersionStore } from '../parts/stores/PartVersionStore';
import { BomTreeNode, usePartUsageChildrenStore } from './stores/PartUsageUsesStore';
import { partUsageService } from './services/PartUsageService';
import 'src/extensions/date.extensions';

const partVersionStore = usePartVersionStore();

const partUsaeChildrenStore = usePartUsageChildrenStore();

const splitterModel = ref(50);

const selected = ref(0);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function onLazyLoad(details: {
  node: BomTreeNode,
  key: string,
  done: (children?: readonly BomTreeNode[] | undefined) => void,
  fail: () => void,
}) {
  const exist = partUsaeChildrenStore.getChildren(details.node.versionId);
  if (exist) {
    details.done([]);
    return;
  }
  const uses = await partUsageService.getByParentVersionId(details.node.versionId);
  if (uses) {
    partUsaeChildrenStore.addUses(uses, details.node.versionId);
    details.done([]);
  }
}

onBeforeMount(async () => {
  const uses = await partUsageService.getByParentVersionId(Number(props.id));
  if (uses) {
    partUsaeChildrenStore.initialize(uses, partVersionStore.content);
  }
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 200px)
</style>
