<template>
  <div>
    <q-banner
      class="bg-primary text-white q-ma-sm"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <div>{{ props.partVersion.master.number }}</div>
        <div>
          <q-badge color="info" class="q-ml-sm">
            v. {{ props.partVersion.version }}
          </q-badge>
        </div>
        <div v-if="props.partVersion.master.viewType === ViewType.Design">
          <q-badge color="secondary" class="q-ml-sm">
            {{ $t('parts.views.design') }}
          </q-badge>
        </div>
        <div v-else>
          <q-badge color="secondary" class="q-ml-sm">
            {{ $t('parts.views.manufacturing') }}
          </q-badge>
        </div>
        <div
          v-if="props.partVersion.master.checkout"
        >
          <q-badge color="orange" class="q-ml-sm">
            {{ $t('actions.checkout') }}
          </q-badge>
        </div>
      </div>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { PartVersion } from '../models/PartVersion';
import { ViewType } from '../models/Part';

const props = withDefaults(defineProps<{
  partVersion: PartVersion,
}>(), {
});
</script>
