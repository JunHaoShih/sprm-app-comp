<template>
  <div class="main-panel q-pa-sm">
    <q-breadcrumbs class="text-primary" active-color="black">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el :label="$t('parts.title')" icon="settings" to="/parts" />
      <q-breadcrumbs-el
        :label="part.number"
        icon="settings"
        :to="`/parts/${routing.partId}/routing`"
      />
      <q-breadcrumbs-el
        :label="routing.name"
        icon="route"
        :to="`/routings/${routing.id}/history`"
      />
    </q-breadcrumbs>
    <q-separator color="black" class="q-mt-sm"/>
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
import { Part } from '../parts/models/Part';
import { partService } from '../parts/services/PartService';

const routing = ref<Routing>({} as Routing);

const part = ref<Part>({} as Part);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function updatePartAndVersion(partId: number) {
  const targetRouting = await routingService.getById(partId);
  if (targetRouting) {
    routing.value = targetRouting;
    const targetPart = await partService.getById(targetRouting.partId);
    if (targetPart) {
      part.value = targetPart;
    }
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
