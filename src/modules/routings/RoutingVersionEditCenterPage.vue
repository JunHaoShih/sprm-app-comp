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
        icon="edit"
        :to="`/routings/version/${id}/info`"
      />
      <q-breadcrumbs-el
        v-if="pageType === 'usages'"
        :label="$t('parts.routings.process')"
        icon="list"
        :to="`/parts/version/${id}/usages`"
      />
    </q-breadcrumbs>
    <q-separator color="black" class="q-my-sm"/>
    <RoutingVersionBanner
      :routing-version="routingVersionStore.content"
    >
      <template v-slot:front>
        <q-icon
          name="edit"
          size="24px"
          class="q-mt-xs q-mr-sm"
          color="primary"
        />
      </template>
      <template v-slot:before-history>
        <q-btn
          :label="$t('iterable.latest')"
          class="q-mr-sm action-btn"
          @click="onLatestClicked(routingVersionStore.content.master.id)"
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
        :to="'/routings/version/edit/' + id + '/info'"
        exact
      />
      <q-route-tab
        icon="list"
        :label="$t('parts.routings.process')"
        :to="'/routings/version/edit/' + id + '/usages'"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import RoutingVersionBanner from './components/RoutingVersionBanner.vue';
import { useRoutingVersionStore } from './stores/RoutingVersionStore';
import { routingService } from './services/RoutingService';
import { partService } from '../parts/services/PartService';
import { Part } from '../parts/models/Part';

const $q = useQuasar();

const i18n = useI18n();

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
  const success = await routingVersionStore.routingVersionInit(partVersionId);
  if (!success) {
    return;
  }
  if (!routingVersionStore.content.isDraft) {
    $q.notify({
      message: i18n.t('parts.versionMustCheckout'),
      color: 'red',
      icon: 'error',
    });
    router.back();
    return;
  }
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
