<template>
  <div class="main-panel q-pa-sm">
    <q-breadcrumbs class="text-primary" active-color="black">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el :label="$t('parts.title')" icon="settings" to="/parts" />
      <q-breadcrumbs-el
        :label="partVersionStore.content.master.number"
        icon="settings"
        :to="`/parts/${partVersionStore.content.master.id}/history`"
      />
      <q-breadcrumbs-el
        v-if="pageType === 'info'"
        :label="$t('info')"
        icon="info"
        :to="`/parts/version/${id}/info`"
      />
      <q-breadcrumbs-el
        v-if="pageType === 'bom'"
        :label="$t('parts.bom')"
        icon="list"
        :to="`/parts/version/${id}/usages`"
      />
    </q-breadcrumbs>
    <q-separator color="black" class="q-mt-sm"/>
    <PartVersionBanner
      :part-version="partVersionStore.content"
    >
      <template v-slot:front>
        <q-icon
          name="info"
          size="24px"
          class="q-mt-xs q-mr-sm"
          color="primary"
        />
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
      inline-label
      indicator-color="orange"
      active-bg-color="grey-4"
      class="tabs-font q-ma-sm tabs-header"
    >
      <q-route-tab
        icon="info"
        :label="$t('parts.info')"
        :to="'/parts/version/' + id + '/info'"
        exact
      />
      <q-route-tab
        icon="list"
        :label="$t('parts.bom')"
        :to="'/parts/version/' + id + '/usages'"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import {
  onBeforeRouteUpdate, useRoute, useRouter,
} from 'vue-router';
import { usePartVersionStore } from '../../../modules/parts/stores/PartVersionStore';
import PartVersionBanner from '../../../modules/parts/components/PartVersionBanner.vue';
import 'src/extensions/date.extensions';
import { partService } from '../../../modules/parts/services/PartService';

const route = useRoute();

const router = useRouter();

const partVersionStore = usePartVersionStore();

type PageType = 'info' | 'bom';

const pageType = ref<PageType>('info');

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

function decidePageType(path: string) {
  if (path.includes('/info')) {
    pageType.value = 'info';
  } else if (path.includes('/usages')) {
    pageType.value = 'bom';
  }
}

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

onBeforeRouteUpdate((to) => {
  decidePageType(to.path);
});

onBeforeMount(async () => {
  await updatePartAndVersion(Number(props.id));
  decidePageType(route.path);
});
</script>

<style lang="sass" scoped>
.tabs-font
  font-family: 'Noto Sans TC'
</style>
