<template>
  <div class="main-panel">
    <PartVersionBanner
      :part-version="partVersionStore.content"
    />
    <q-tabs
      align="left"
      indicator-color="orange"
      class="tabs-font"
    >
      <q-route-tab
        :label="$t('parts.info')"
        :to="'/parts/version/edit/' + id + '/info'"
        exact
      />
      <q-route-tab
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
  if (!partVersionStore.content.checkout) {
    $q.notify({
      message: i18n.t('parts.versionMustCheckout'),
      color: 'red',
      icon: 'error',
    });
    router.back();
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
