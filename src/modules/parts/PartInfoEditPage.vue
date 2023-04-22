<template>
  <div class="q-pa-sm main-panel">
    <PartInfoPanel
      :id="id"
      :readonly="false"
      v-model="partVersionStore.content"
    />
    <q-footer elevated>
      <q-toolbar>
        <q-space />
        <q-btn
          color="deep-orange"
          glossy
          label="Save"
          @click="onSaveClicked"
        />
      </q-toolbar>
    </q-footer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import PartInfoPanel from './components/PartInfoPanel.vue';
import { usePartVersionStore } from '../parts/stores/PartVersionStore';
import { partVersionService } from './services/PartVersionService';
import { useAttributeLinksStore } from '../customs/stores/AttributeLinksStore';
import 'src/extensions/date.extensions';

const i18n = useI18n();

const $q = useQuasar();

const partVersionStore = usePartVersionStore();

const attrLinksStore = useAttributeLinksStore();

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function onSaveClicked(): Promise<void> {
  const code = await partVersionService.update(partVersionStore.content.id, {
    customValues: partVersionStore.content.customValues,
    remarks: partVersionStore.content.remarks,
  });
  if (code === 0) {
    $q.notify({
      message: i18n.t('actions.updates.success'),
      color: 'secondary',
    });
  }
}

onBeforeMount(async () => {
  partVersionStore.content.customValues = Object.fromEntries(attrLinksStore.content.attributes.map((attr) => [attr.number, '']));
  const targetVersion = await partVersionService.getById(Number(props.id));
  if (targetVersion) {
    partVersionStore.content = targetVersion;
  }
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 70px)
</style>
