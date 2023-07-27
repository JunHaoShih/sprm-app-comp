<template>
  <div class="q-pa-sm main-panel">
    <div v-if="routingVersionStore.content.id">
      <RoutingInfoForm
        :readonly="true"
        :on-submit="onSaveClicked"
        v-model="routingVersionStore.content"
        panel-class="outer-max"
      >
      </RoutingInfoForm>
    </div>
    <div v-else class="row justify-center items-center outer-max">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import 'src/extensions/date.extensions';
import RoutingInfoForm from '../../../../modules/routings/components/RoutingInfoForm.vue';
import { useRoutingVersionStore } from '../../../../modules/routings/stores/RoutingVersionStore';
import { routingVersionService } from '../../../../modules/routings/services/RoutingVersionService';

const i18n = useI18n();

const $q = useQuasar();

const routingVersionStore = useRoutingVersionStore();

async function onSaveClicked(): Promise<void> {
  const code = await routingVersionService.update(routingVersionStore.content.id, {
    customValues: routingVersionStore.content.customValues,
    remarks: routingVersionStore.content.remarks,
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
  height: calc(100vh - 270px)
</style>
