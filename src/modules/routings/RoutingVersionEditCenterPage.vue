<template>
  <div class="main-panel">
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
        :label="$t('parts.info')"
        :to="'/routings/version/edit/' + id + '/info'"
        exact
      />
      <q-route-tab
        icon="list"
        :label="$t('parts.bom')"
        :to="'/routings/version/edit/' + id + '/usages'"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import RoutingVersionBanner from './components/RoutingVersionBanner.vue';
import { useRoutingVersionStore } from './stores/RoutingVersionStore';
import { routingService } from './services/RoutingService';

const $q = useQuasar();

const i18n = useI18n();

const router = useRouter();

const routingVersionStore = useRoutingVersionStore();

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

onBeforeMount(async () => {
  await updatePartAndVersion(Number(props.id));
});
</script>

<style lang="sass" scoped>
.tabs-font
  font-family: 'Noto Sans TC'
</style>
