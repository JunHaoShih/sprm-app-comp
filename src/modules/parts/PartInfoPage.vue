<template>
  <div class="q-pa-sm main-panel">
    <PartInfoPanel
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
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 70px)
</style>
