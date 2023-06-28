<template>
  <div class="main-panel">
    <RoutingBanner
      :routing="routing"
    />
    <q-tabs
      align="justify"
      inline-label
      indicator-color="orange"
      active-bg-color="grey-4"
      class="tabs-font q-ma-sm tabs-header"
    >
      <q-route-tab
        icon="history"
        :label="$t('iterable.history')"
        :to="'/routings/' + id + '/history'"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import RoutingBanner from './components/RoutingBanner.vue';
import 'src/extensions/date.extensions';
import { Routing } from './models/Routing';
import { routingService } from './services/RoutingService';

const routing = ref<Routing>({} as Routing);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function updatePartAndVersion(partId: number) {
  const targetPart = await routingService.getById(partId);
  if (targetPart) {
    routing.value = targetPart;
  }
}

watch(() => props.id, async (newValue) => {
  await updatePartAndVersion(Number(newValue));
});

onBeforeMount(async () => {
  await updatePartAndVersion(Number(props.id));
});
</script>

<style lang="sass" scoped>
.tabs-font
  font-family: 'Noto Sans TC'
</style>
