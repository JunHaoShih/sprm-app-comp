<template>
  <div class="q-pa-sm main-panel">
    <div v-if="processStore.content.id">
      <ProcessForm
        :readonly="false"
        :on-submit="onSaveClicked"
        v-model="processStore.content"
        panel-class="outer-max"
      >
        <template v-slot:after>
          <q-footer elevated>
            <q-toolbar class="bg-dark">
              <q-space />
              <q-btn
                color="deep-orange"
                glossy
                label="Save"
                type="submit"
              />
            </q-toolbar>
          </q-footer>
        </template>
      </ProcessForm>
    </div>
    <div v-else class="row justify-center items-center outer-max">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import ProcessForm from './ProcessForm.vue';
import { Process } from '../models/Process';
import { useProcessStore } from '../stores/ProcessStore';
import { processService } from '../services/ProcessService';

const i18n = useI18n();

const $q = useQuasar();

const processStore = useProcessStore();

async function onSaveClicked(): Promise<void> {
  console.log(processStore.content);
  /* const code = await processService.update(partVersionStore.content.id, {
    customValues: partVersionStore.content.customValues,
    remarks: partVersionStore.content.remarks,
  });
  if (code === 0) {
    $q.notify({
      message: i18n.t('actions.updates.success'),
      color: 'secondary',
      icon: 'check_circle',
    });
  } */
}
</script>

<style lang="sass" scoped>
:deep(.outer-max)
  height: calc(100vh - 270px)
</style>
