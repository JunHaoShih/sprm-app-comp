<template>
  <div class="q-pa-sm main-panel">
    <PartInfoPanel
      :id="props.id"
      :readonly="true"
      v-model="partVersionStore.content"
    />
  </div>
</template>

<script setup lang="ts">
import PartInfoPanel from './components/PartInfoPanel.vue';
import { usePartVersionStore } from '../parts/stores/PartVersionStore';
import 'src/extensions/date.extensions';

const partVersionStore = usePartVersionStore();

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 70px)
</style>
