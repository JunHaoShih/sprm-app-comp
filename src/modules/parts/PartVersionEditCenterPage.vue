<template>
  <div class="main-panel">
    <PartVersionBanner
      :part-version="partVersionStore.content"
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
          @click="onLatestClicked(partVersionStore.content.master.id)"
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
        :to="'/parts/version/edit/' + id + '/info'"
        exact
      />
      <q-route-tab
        icon="list"
        :label="$t('parts.bom')"
        :to="'/parts/version/edit/' + id + '/usages'"
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
import { usePartVersionStore } from './stores/PartVersionStore';
import PartVersionBanner from './components/PartVersionBanner.vue';
import 'src/extensions/date.extensions';
import { partService } from './services/PartService';

const $q = useQuasar();

const i18n = useI18n();

const router = useRouter();

const partVersionStore = usePartVersionStore();

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function updatePartAndVersion(partVersionId: number) {
  const success = await partVersionStore.partVersionInit(partVersionId);
  if (!success) {
    return;
  }
  if (!partVersionStore.content.isDraft) {
    $q.notify({
      message: i18n.t('parts.versionMustCheckout'),
      color: 'red',
      icon: 'error',
    });
    router.back();
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
