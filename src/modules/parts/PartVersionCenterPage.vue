<template>
  <div class="main-panel">
    <PartVersionBanner
      :part-version="partVersionStore.content"
    >
      <template v-slot:front>
        <q-icon name="info" size="24px" class="q-mt-xs q-mr-sm"/>
      </template>
    </PartVersionBanner>
    <q-tabs
      align="left"
      indicator-color="orange"
      class="tabs-font"
    >
      <q-route-tab
        :label="$t('parts.info')"
        :to="'/parts/version/' + id + '/info'"
        exact
      />
      <q-route-tab
        :label="$t('parts.bom')"
        :to="'/parts/version/' + id + '/usages'"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, watch } from 'vue';
import { usePartVersionStore } from './stores/PartVersionStore';
import PartVersionBanner from './components/PartVersionBanner.vue';
import 'src/extensions/date.extensions';

const partVersionStore = usePartVersionStore();

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function updatePartAndVersion(partVersionId: number) {
  await partVersionStore.partVersionInit(partVersionId);
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
