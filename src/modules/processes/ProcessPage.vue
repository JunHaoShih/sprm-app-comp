<template>
  <div class="q-pa-sm main-panel">
    <div v-if="processStore.content.id">
      <ProcessForm
        :readonly="true"
        v-model="processStore.content"
        panel-class="outer-max"
      >
      </ProcessForm>
    </div>
    <div v-else class="row justify-center items-center outer-max">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProcessForm from './components/ProcessForm.vue';
import { useProcessStore } from './stores/ProcessStore';

const processStore = useProcessStore();
</script>

<style lang="sass" scoped>
:deep(.outer-max)
  height: calc(100vh - 230px)
</style>
