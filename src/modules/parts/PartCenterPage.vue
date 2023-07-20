<template>
  <div class="main-panel q-pa-sm">
    <q-breadcrumbs class="text-primary" active-color="black">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el :label="$t('parts.title')" icon="settings" to="/parts" />
      <q-breadcrumbs-el
        :label="part.number"
        icon="settings"
        :to="`/parts/${id}/history`"
      />
    </q-breadcrumbs>
    <q-separator color="black" class="q-mt-sm"/>
    <PartBanner
      :part="part"
    />
    <q-tabs
      align="justify"
      inline-label
      indicator-color="orange"
      active-bg-color="grey-4"
      class="tabs-font q-mx-sm tabs-header"
    >
      <q-route-tab
        icon="history"
        :label="$t('iterable.history')"
        :to="'/parts/' + id + '/history'"
        exact
      />
      <q-route-tab
        icon="route"
        :label="$t('parts.routing')"
        :to="'/parts/' + id + '/routing'"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { partService } from './services/PartService';
import { Part } from './models/Part';
import PartBanner from './components/PartBanner.vue';
import 'src/extensions/date.extensions';

const part = ref<Part>({} as Part);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function updatePartAndVersion(partId: number) {
  const targetPart = await partService.getById(partId);
  if (targetPart) {
    part.value = targetPart;
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
