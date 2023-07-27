<template>
  <div class="q-pa-sm main-panel">
    <div v-if="partVersionStore.partVersion.id">
      <PartInfoForm
        :readonly="false"
        :on-submit="onSaveClicked"
        v-model="partVersionStore.partVersion"
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
      </PartInfoForm>
    </div>
    <div v-else class="row justify-center items-center outer-max">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import PartInfoForm from '../../../../../modules/parts/components/PartInfoForm.vue';
import { usePartVersionStore } from '../../../../../modules/parts/stores/PartVersionStore';
import { partVersionService } from '../../../../../modules/parts/services/PartVersionService';
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
      type: 'success',
      message: i18n.t('actions.updates.success'),
    });
  }
}
</script>

<style lang="sass" scoped>
:deep(.outer-max)
  height: calc(100vh - 320px)
</style>
