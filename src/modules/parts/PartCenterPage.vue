<template>
  <div class="main-panel">
    <PartBanner
      :part="part"
    />
    <q-tabs
      align="justify"
      indicator-color="orange"
      active-bg-color="grey-4"
      class="tabs-font q-ma-sm tabs-header"
    >
      <q-route-tab
        :label="$t('iterable.history')"
        :to="'/parts/' + id + '/history'"
        exact
      />
      <q-route-tab
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
