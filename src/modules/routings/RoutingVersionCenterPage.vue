<template>
  <div class="main-panel q-pa-sm">
    <q-breadcrumbs class="text-primary" active-color="black">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el :label="$t('parts.title')" icon="settings" to="/parts" />
      <q-breadcrumbs-el
        :label="part.number"
        icon="settings"
        :to="`/parts/${routingVersionStore.content.master.partId}/routing`"
      />
      <q-breadcrumbs-el
        :label="routingVersionStore.content.master.name"
        icon="route"
        :to="`/routings/${routingVersionStore.content.master.id}/history`"
      />
      <q-breadcrumbs-el
        v-if="pageType === 'info'"
        :label="$t('info')"
        icon="info"
        :to="`/routings/version/${id}/info`"
      />
      <q-breadcrumbs-el
        v-else
        :label="$t('parts.routings.process')"
        icon="list"
        :to="`/parts/version/${id}/usages`"
      />
    </q-breadcrumbs>
    <q-separator color="black" class="q-mt-sm"/>
    <RoutingVersionBanner
      :routing-version="routingVersionStore.content"
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
          v-if="!routingVersionStore.content.isLatest"
          :label="$t('iterable.latest')"
          class="q-mr-sm action-btn"
          @click="onLatestClicked(routingVersionStore.content.master.id)"
        />
        <q-btn
          v-if="routingVersionStore.content.master.checkout"
          :label="$t('actions.draft')"
          class="q-mr-sm action-btn"
          @click="onEditClicked(routingVersionStore.content.master.id)"
        />
      </template>
    </RoutingVersionBanner>
    <q-tabs
      align="justify"
      inline-label
      indicator-color="orange"
      active-bg-color="grey-4"
      class="tabs-font q-ma-sm tabs-header"
    >
      <q-route-tab
        icon="info"
        :label="$t('info')"
        :to="'/routings/version/' + id + '/info'"
        exact
      />
      <q-route-tab
        icon="list"
        :label="$t('parts.routings.process')"
        :to="'/routings/version/' + id + '/usages'"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import 'src/extensions/date.extensions';
import RoutingVersionBanner from './components/RoutingVersionBanner.vue';
import { useRoutingVersionStore } from './stores/RoutingVersionStore';
import { routingService } from './services/RoutingService';
import { Part } from '../parts/models/Part';
import { partService } from '../parts/services/PartService';

const route = useRoute();

const router = useRouter();

const routingVersionStore = useRoutingVersionStore();

type PageType = 'info' | 'usages';

const pageType = ref<PageType>('info');

const part = ref<Part>({} as Part);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function updatePartAndVersion(partVersionId: number) {
  await routingVersionStore.routingVersionInit(partVersionId);
  const targetPart = await partService.getById(routingVersionStore.content.master.partId);
  if (targetPart) {
    part.value = targetPart;
  }
}

async function onLatestClicked(masterId: number) {
  const routing = await routingService.getById(masterId);
  if (routing) {
    router.push(`/routings/version/${routing.version.id}/info`);
  }
}

async function onEditClicked(masterId: number) {
  const routing = await routingService.getById(masterId);
  if (routing) {
    router.push(`/routings/version/edit/${routing.draftId}/info`);
  }
}

watch(() => props.id, async (newValue) => {
  await updatePartAndVersion(Number(newValue));
});

function decidePageType(path: string) {
  if (path.includes('/info')) {
    pageType.value = 'info';
  } else if (path.includes('/usages')) {
    pageType.value = 'usages';
  }
}

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
