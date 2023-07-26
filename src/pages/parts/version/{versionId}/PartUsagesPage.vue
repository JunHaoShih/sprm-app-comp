<template>
  <div class="q-px-sm">
    <q-separator />
    <!-- splitter area -->
    <q-splitter
      v-model="splitterModel"
      class="outer-max"
    >
      <template v-slot:before>
        <PartUsageTreePanel
          class="q-pa-md q-gutter-sm"
          :id="Number(props.id)"
          v-model:selectedNode="selectedNode"
          :isEdit="false"
        >
        </PartUsageTreePanel>
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
import { computed, ref } from 'vue';
import PartUsageRightPanel from '../../../../modules/partUsages/components/PartUsageRightPanel.vue';
import PartUsageTreePanel from '../../../../modules/partUsages/components/PartUsageTreePanel.vue';
import 'src/extensions/date.extensions';
import { BomTreeNode } from '../../../../modules/partUsages/stores/BomTreeStore';

const splitterModel = ref(50);

const selectedNode = ref<BomTreeNode>({} as BomTreeNode);

const selectedParentId = computed(
  (): number => {
    if (Object.keys(selectedNode).length === 0) {
      return 0;
    }
    return selectedNode.value.versionId;
  },
);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 225px)
</style>
