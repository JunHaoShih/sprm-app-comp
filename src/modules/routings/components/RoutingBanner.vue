<template>
  <div>
    <q-banner
      class="info-banner"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <q-icon name="route" size="24px" class="q-mt-xs q-mr-sm"/>
        <div>{{ routing.name }}</div>
        <div
          v-if="routing.checkout"
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
import { Routing } from '../models/Routing';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<{
  routing: Routing,
}>(), {
});
</script>
