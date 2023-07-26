<template>
  <div class="q-pa-sm main-panel">
    <PartInfoForm
      v-if="partVersionStore.content.id"
      :readonly="true"
      v-model="partVersionStore.partVersion"
      panel-class="outer-max"
    />
    <div v-else class="row justify-center items-center outer-max">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import PartInfoForm from '../../../../modules/parts/components/PartInfoForm.vue';
import { usePartVersionStore } from '../../../../modules/parts/stores/PartVersionStore';
import 'src/extensions/date.extensions';

const partVersionStore = usePartVersionStore();
</script>

<style lang="sass" scoped>
:deep(.outer-max)
  height: calc(100vh - 270px)
</style>
