<template>
  <div>
    <q-banner
      class="info-banner"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <div>{{ part.number }}</div>
        <div
          v-if="part.checkout"
          class="q-ml-sm"
        >
          <q-badge color="orange">
            {{ $t('actions.checkout') }}
          </q-badge>
        </div>
      </div>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { Part } from '../models/Part';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<{
  part: Part,
}>(), {
});
</script>
