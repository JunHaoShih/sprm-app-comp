<template>
  <div class="main-panel">
    <ProcessBanner
      :process="processStore.content"
    >
    </ProcessBanner>
    <q-tabs
      align="justify"
      inline-label
      indicator-color="orange"
      active-bg-color="grey-4"
      class="tabs-font q-ma-sm tabs-header"
    >
      <q-route-tab
        icon="info"
        :label="$t('parts.info')"
        :to="`/processes/${id}/info`"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import ProcessBanner from '../../modules/processes/components/ProcessBanner.vue';
import { useProcessStore } from '../../modules/processes/stores/ProcessStore';

const processStore = useProcessStore();

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

onBeforeRouteUpdate(async (to) => {
  await processStore.processInit(Number(to.params.id));
});

onBeforeMount(async () => {
  await processStore.processInit(Number(props.id));
});
</script>
