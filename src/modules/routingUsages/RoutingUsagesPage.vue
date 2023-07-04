<template>
  <div class="q-px-sm">
    <q-separator />
    <!-- splitter area -->
    <q-splitter
      v-model="splitterModel"
      class="outer-max"
    >
      <template v-slot:before>
        <RoutingUsagesTreePanel
          class="q-pa-md q-gutter-xs"
          :id="Number(props.id)"
          v-model:selected-node="selectedNode"
        >
        </RoutingUsagesTreePanel>
      </template>

      <template v-slot:after>
        <div class="q-gutter-sm">
          <RoutibgUsagesRightPanel
            :selected-node="selectedNode"
            :readonly="true"
          >
          </RoutibgUsagesRightPanel>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import 'src/extensions/date.extensions';
import RoutingUsagesTreePanel from './components/RoutingUsagesTreePanel.vue';
import RoutibgUsagesRightPanel from './components/RoutingUsagesRightPanel.vue';
import { RoutingUsageTreeNode } from './stores/RoutingUsagesMapStore';

const splitterModel = ref(50);

const selectedNode = ref<RoutingUsageTreeNode>({} as RoutingUsageTreeNode);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 190px)
</style>
