<template>
  <div class="main-panel">
    <q-banner
      class="bg-primary text-white q-ma-sm"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <div>{{ partVersionStore.content.master.number }}</div>
        <div>
          [{{ partVersionStore.content.version }}]
        </div>
        <div v-if="partVersionStore.content.master.viewType === ViewType.Design">
          [{{ $t('parts.views.design') }}]
        </div>
        <div v-else>
          [{{ $t('parts.views.manufacturing') }}]
        </div>
        <div class="q-ml-sm">
          <q-icon
            v-if="partVersionStore.content.master.checkout"
            name="warning"
            color="orange"
            size="8px">
            <q-tooltip>
              {{ $t('actions.checkout') }}
            </q-tooltip>
          </q-icon>
        </div>
      </div>
    </q-banner>
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
import { ViewType } from './models/Part';
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
