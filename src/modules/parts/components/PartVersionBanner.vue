<template>
  <div>
    <q-banner
      class="bg-primary text-white q-ma-sm"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <slot name="front"></slot>
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
        <q-space/>
        <div>
          <q-btn
            push
            :label="$t('iterable.history')"
            color="white"
            text-color="primary"
            @click="toHistory"
          />
        </div>
      </div>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { PartVersion } from '../models/PartVersion';
import { ViewType } from '../models/Part';

const router = useRouter();

const props = withDefaults(defineProps<{
  partVersion: PartVersion,
}>(), {
});

function toHistory() {
  router.push(`/parts/${props.partVersion.master.id}/history`);
}
</script>
