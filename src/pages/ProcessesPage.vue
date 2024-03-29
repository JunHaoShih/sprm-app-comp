<template>
  <div class="q-pa-sm">
    <!-- product files table -->
    <ProcessesSearchPanel
      v-model="pattern"
      :readonly="true"
      v-model:selected="selected"
      selection="multiple"
      class="main-panel"
      table-class="outer-max sticky-header-table"
      @on-search="onSearch"
    >
      <template v-slot:table-top>
        <q-btn
          :label="$t('actions.add')"
          @click="prompt=true"
          class="action-btn"
        />
      </template>
      <template v-slot:row-actions="props">
        <q-btn
          dense
          round
          flat
          color="grey"
          icon="edit"
          size="sm"
          @click="onEditClicked(props.process)"
        />
        <q-btn
          dense
          round
          flat
          color="grey"
          icon="delete"
          size="sm"
          @click="onDeleteClicked(props.process)"
        />
        <q-btn
          dense
          round
          flat
          color="grey"
          icon="info"
          size="sm"
          :to="`/processes/${props.process.id}/info`"
        />
      </template>
      <template v-slot:cell-after="props">
        <q-menu touch-position context-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section
                @click="onEditClicked(props.process)"
              >
                <div>
                  <q-icon name="edit" color="primary"/>
                  {{ $t('actions.edit') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <div>
                  <q-icon name="delete" color="red"/>
                  {{ $t('actions.delete') }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
    </ProcessesSearchPanel>
    <CreateProcessDialog
      v-model="prompt"
      @onProcessCreated="onProcessCreated">
    </CreateProcessDialog>
  </div>
</template>

<script setup lang="ts">
import {
  LocationQueryValue, onBeforeRouteUpdate, useRoute, useRouter,
} from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { onBeforeMount, ref } from 'vue';
import ProcessesSearchPanel from '../modules/processes/components/ProcessesSearchPanel.vue';
import { useProcessesStore } from '../modules/processes/stores/ProcessesStore';
import { Process } from '../modules/processes/models/Process';
import CreateProcessDialog from '../modules/processes/components/CreateProcessDialog.vue';
import { processService } from '../modules/processes/services/ProcessService';

const $q = useQuasar();

const i18n = useI18n();

const route = useRoute();

const router = useRouter();

const processesStore = useProcessesStore();

const pattern = ref('');

const prompt = ref(false);

const selected = ref<Process[]>([]);

function onEditClicked(process: Process): void {
  router.push(`/processes/edit/${process.id}/info`);
}

function onDeleteClicked(process: Process): void {
  $q.dialog({
    title: 'Confirm',
    message: `${i18n.t('actions.deletes.confirm')} ${process.number}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const success = await processService.remove(process.id);
    if (success) {
      $q.notify({
        type: 'success',
        message: `${process.number}: ${i18n.t('actions.deletes.success')}`,
      });
      processesStore.removeProcess(process);
    }
  });
}

function onProcessCreated(newProcess: Process) {
  processesStore.unshiftProcess(newProcess);
}

async function updatePattern(queryValue: LocationQueryValue | LocationQueryValue[]) {
  const newPattern = queryValue as string;
  pattern.value = newPattern;
}

function onSearch(searchPattern: string) {
  pattern.value = searchPattern;
  router.push({
    path: '/processes',
    query: { pattern: searchPattern },
  });
}

onBeforeRouteUpdate(async (to) => {
  await updatePattern(to.query.pattern);
});

onBeforeMount(async () => {
  await updatePattern(route.query.pattern);
});
</script>

<style lang="sass" scoped>
:deep(.outer-max)
  height: calc(100vh - 125px)
</style>
