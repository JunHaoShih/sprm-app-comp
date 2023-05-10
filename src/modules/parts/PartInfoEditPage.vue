<template>
  <div class="q-pa-sm main-panel">
    <div v-if="partVersionStore.partVersion.id">
      <PartInfoPanel
        :readonly="false"
        v-model="partVersionStore.partVersion"
      >
        <template v-slot:after>
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
        </template>
      </PartInfoPanel>
    </div>
    <div v-else class="row justify-center items-center outer-max">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import PartInfoPanel from './components/PartInfoPanel.vue';
import { usePartVersionStore } from '../parts/stores/PartVersionStore';
import { partVersionService } from './services/PartVersionService';
import 'src/extensions/date.extensions';

const i18n = useI18n();

const $q = useQuasar();

const partVersionStore = usePartVersionStore();

async function onSaveClicked(): Promise<void> {
  const code = await partVersionService.update(partVersionStore.content.id, {
    customValues: partVersionStore.content.customValues,
    remarks: partVersionStore.content.remarks,
  });
  if (code === 0) {
    $q.notify({
      message: i18n.t('actions.updates.success'),
      color: 'secondary',
      icon: 'check_circle',
    });
  }
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 200px)
</style>
