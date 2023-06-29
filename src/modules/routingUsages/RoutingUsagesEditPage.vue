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
          :id="Number(props.id)"
          :selected-node="selectedNode"
        >
        </RoutingUsagesTreePanel>
      </template>

      <template v-slot:after>
        {{ 456 }}
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import 'src/extensions/date.extensions';
import RoutingUsagesTreePanel from './components/RoutingUsagesTreePanel.vue';
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
