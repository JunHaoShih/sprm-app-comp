<template>
  <div>
    <q-banner
      class="info-banner q-ma-sm"
    >
      <div class="text-h6 row">
        <slot name="front"></slot>
        <q-icon name="route" size="24px" class="q-mt-xs q-mr-sm"/>
        <div>{{ props.routingVersion.master.name }}</div>
        <div>
          <q-badge color="primary" class="q-ml-sm">
            v. {{ props.routingVersion.version }}
          </q-badge>
        </div>
        <div
          v-if="props.routingVersion.master.checkout"
        >
          <q-badge color="orange" class="q-ml-sm">
            {{ $t('actions.checkout') }}
          </q-badge>
        </div>
        <q-space/>
        <slot name="before-history"></slot>
        <div>
          <q-btn
            :label="$t('iterable.history')"
            class="action-btn"
            @click="toHistory"
          />
        </div>
      </div>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RoutingVersion } from '../models/RoutingVersion';

const router = useRouter();

const props = withDefaults(defineProps<{
  routingVersion: RoutingVersion,
}>(), {
});

function toHistory() {
  router.push(`/routings/${props.routingVersion.master.id}/history`);
}
</script>
