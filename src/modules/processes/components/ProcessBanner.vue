<template>
  <div>
    <q-banner
      class="info-banner q-ma-sm"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <q-icon name="route" size="24px" class="q-mt-xs q-mr-sm"/>
        <div>{{ process.number }}</div>
      </div>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { Process } from '../models/Process';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<{
  process: Process,
}>(), {
});
</script>
