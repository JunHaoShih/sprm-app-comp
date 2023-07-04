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
import { onBeforeMount, watch } from 'vue';
import { useRouter } from 'vue-router';
import 'src/extensions/date.extensions';
import RoutingVersionBanner from './components/RoutingVersionBanner.vue';
import { useRoutingVersionStore } from './stores/RoutingVersionStore';
import { routingService } from './services/RoutingService';

const router = useRouter();

const routingVersionStore = useRoutingVersionStore();

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function updatePartAndVersion(partVersionId: number) {
  await routingVersionStore.routingVersionInit(partVersionId);
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

onBeforeMount(async () => {
  await updatePartAndVersion(Number(props.id));
});
</script>

<style lang="sass" scoped>
.tabs-font
  font-family: 'Noto Sans TC'
</style>
