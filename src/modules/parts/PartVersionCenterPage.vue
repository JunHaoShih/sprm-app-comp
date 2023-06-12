<template>
  <div class="main-panel">
    <PartVersionBanner
      :part-version="partVersionStore.content"
    >
      <template v-slot:front>
        <q-icon name="info" size="24px" class="q-mt-xs q-mr-sm"/>
      </template>
      <template v-slot:before-history>
        <q-btn
          v-if="!partVersionStore.content.isLatest"
          :label="$t('iterable.latest')"
          class="q-mr-sm action-btn"
          @click="onLatestClicked(partVersionStore.content.master.id)"
        />
        <q-btn
          v-if="partVersionStore.content.master.checkout"
          :label="$t('actions.draft')"
          class="q-mr-sm action-btn"
          @click="onEditClicked(partVersionStore.content.master.id)"
        />
      </template>
    </PartVersionBanner>
    <q-tabs
      align="justify"
      indicator-color="orange"
      active-bg-color="grey-4"
      class="tabs-font q-ma-sm tabs-header"
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
import { useRouter } from 'vue-router';
import { usePartVersionStore } from './stores/PartVersionStore';
import PartVersionBanner from './components/PartVersionBanner.vue';
import 'src/extensions/date.extensions';
import { partService } from './services/PartService';

const router = useRouter();

const partVersionStore = usePartVersionStore();

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function updatePartAndVersion(partVersionId: number) {
  await partVersionStore.partVersionInit(partVersionId);
}

async function onEditClicked(masterId: number) {
  const part = await partService.getById(masterId);
  if (part) {
    router.push(`/parts/version/edit/${part.draftId}/info`);
  }
}

async function onLatestClicked(masterId: number) {
  const part = await partService.getById(masterId);
  if (part) {
    router.push(`/parts/version/${part.version.id}/info`);
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
