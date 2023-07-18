<template>
  <div v-if="!initializing">
    <!-- tabs -->
    <q-tabs
      v-model="tab"
      dense
      indicator-color="orange"
      active-bg-color="grey-4"
      class="tabs-font q-ma-sm tabs-header"
      align="justify"
      narrow-indicator
    >
      <q-tab name="usage" :label="$t('parts.routings.process')" />
      <q-tab name="process" :label="$t('processes.process')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated keep-alive>
      <q-tab-panel name="usage">
        <q-table
          :rows="routingUsages"
          :columns="columns"
          :pagination="pagination"
          row-key="key"
          dense
          class="outer-max"
          style="position: sticky; top: 0"
        >
          <!-- button at table header -->
          <template v-slot:top>
            <div class="q-gutter-xs">
              <ColumnDisplaySwitchPanel
                :locale="i18n.locale.value"
                :attributes="attributes"
                :can-display="canDisplay"
                :display-map="displayMap"
                :default-columns="defaultColumns">
              </ColumnDisplaySwitchPanel>
            </div>
            <q-space />
          </template>
          <!-- action buttons -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                v-if="!readonly"
                dense
                round
                flat
                color="grey"
                icon="edit"
                size="sm"
                @click="onEditClicked(props.row as RoutingUsage)"
              />
            </q-td>
          </template>
          <!-- child number -->
          <template v-slot:body-cell-usesNumber="props">
            <q-td :props="props">
              {{ props.row.child.number }}
            </q-td>
          </template>
          <!-- child name -->
          <template v-slot:body-cell-usesName="props">
            <q-td :props="props">
              {{ props.row.child.name }}
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="process">
        <ProcessForm
          v-if="targetProcess"
          :readonly="true"
          v-model="targetProcess"
          panel-class="info-outer-max"
        />
      </q-tab-panel>
    </q-tab-panels>
    <PopupDialog
      v-model="prompt"
      :title="$t('parts.routings.processes.edit')"
    >
      <template v-slot:center>
        <RoutingUsageForm
          ref="formRef"
          v-model="modifiedUsage"
          :readonly="false"
          :on-submit="updateUsage"
        >
        </RoutingUsageForm>
      </template>
      <template v-slot:bottom>
        <q-btn flat :label="$t('actions.cancel')" v-close-popup />
        <q-btn flat :label="$t('actions.confirm')" @click="onConfirm" />
      </template>
    </PopupDialog>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { CustomAttribute } from 'src/modules/customs/models/CustomAttribute';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { processService } from 'src/modules/processes/services/ProcessService';
import { useProcessesStore } from 'src/modules/processes/stores/ProcessesStore';
import ColumnDisplaySwitchPanel from 'src/components/ColumnDisplaySwitchPanel.vue';
import PopupDialog from 'src/components/PopupDialog.vue';
import ProcessForm from 'src/modules/processes/components/ProcessForm.vue';
import { RoutingUsageTreeNode, useRoutingUsagesMapStore } from '../stores/RoutingUsagesMapStore';
import { routingUsageService } from '../services/RoutingUsageService';
import { RoutingUsage } from '../models/RoutingUsage';
import { UpdateRoutingUsageDTO } from '../dtos/UpdateRoutingUsageDTO';
import RoutingUsageForm from './RoutingUsageForm.vue';

const $q = useQuasar();

const i18n = useI18n();

const processesStore = useProcessesStore();

const routingUsagesMapStore = useRoutingUsagesMapStore();

const attrLinksStore = useAttributeLinksStore();

const formRef = ref<InstanceType<typeof RoutingUsageForm>>();

const tab = ref('usage');

const initializing = ref(true);

const prompt = ref(false);

const canDisplay = ref<Record<string, boolean>>({} as Record<string, boolean>);

const displayMap = ref<Record<string, boolean>>({} as Record<string, boolean>);

const sprmObjectType = SprmObjectType.RoutingUsage;

const attributes = ref<CustomAttribute[]>([]);

const modifiedUsage = ref<RoutingUsage>({} as RoutingUsage);

const props = withDefaults(defineProps<{
  readonly: boolean,
  selectedNode: RoutingUsageTreeNode,
}>(), {
  readonly: true,
});

const routingUsages = computed(
  () => {
    const children = routingUsagesMapStore.children(props.selectedNode.usageId);
    if (children) {
      return routingUsageService.toRecords(children);
    }
    return [];
  },
);

const targetProcess = computed(
  () => processesStore.processes.find((process) => process.id === props.selectedNode.processId),
);

const pagination: QTableProps['pagination'] = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
};

const defaultColumns = computed(
  (): QTableProps['columns'] => [
    {
      name: 'actions', label: i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
    },
    {
      name: 'number', required: true, label: i18n.t('parts.routings.processes.number'), align: 'left', field: 'number', sortable: true,
    },
    {
      name: 'processNumber', required: true, label: i18n.t('processes.number'), align: 'left', field: 'processNumber', sortable: true,
    },
    {
      name: 'processName', label: i18n.t('processes.name'), field: 'processName', align: 'left', sortable: true,
    },
  ],
);

const columns = computed(
  (): QTableProps['columns'] => {
    const filteredColumns = defaultColumns.value?.filter((column) => displayMap.value[column.name]);
    attributes.value.forEach((attr) => {
      if (!canDisplay.value[attr.number]) {
        return;
      }
      const currentLabel = attr.languages[i18n.locale.value] || attr.name;
      filteredColumns?.push({
        name: attr.number,
        label: currentLabel,
        field: attr.number,
        align: 'left',
        sortable: true,
      });
    });
    return filteredColumns;
  },
);

function onEditClicked(row: RoutingUsage) {
  modifiedUsage.value = row;
  prompt.value = true;
}

function onConfirm() {
  formRef.value?.submit();
}

async function updateUsage() {
  const dto: UpdateRoutingUsageDTO = {
    remarks: modifiedUsage.value.remarks,
    number: modifiedUsage.value.number,
    processId: modifiedUsage.value.processId,
    customValues: modifiedUsage.value.customValues,
  };
  const success = await routingUsageService.update(modifiedUsage.value.id, dto);
  if (success) {
    routingUsagesMapStore.updateUsage(modifiedUsage.value);
    $q.notify({
      message: i18n.t('actions.updates.success'),
      icon: 'check_circle',
      color: 'secondary',
    });
    prompt.value = false;
  }
}

async function processInit() {
  if (props.selectedNode.processId === undefined) {
    return;
  }
  const index = processesStore.processes
    .findIndex((currentProcess) => currentProcess.id === props.selectedNode.processId);
  if (index === -1) {
    const process = await processService.getById(props.selectedNode.processId);
    if (process) {
      processesStore.addProcess(process);
    }
  }
}

watch(() => props.selectedNode.processId, async () => {
  await processInit();
});

onBeforeMount(async () => {
  initializing.value = true;
  await Promise.all([
    processInit(),
    attrLinksStore.initialize(sprmObjectType),
  ]);
  attributes.value = attrLinksStore.attributes(sprmObjectType);
  attributes.value.forEach((attr) => {
    canDisplay.value[attr.number] = true;
  });
  defaultColumns.value?.forEach((column) => {
    displayMap.value[column.name] = true;
  });
  initializing.value = false;
});
</script>

<style lang="sass" scoped>
:deep(.info-outer-max)
  height: calc(100vh - 300px)

.outer-max
  height: calc(100vh - 270px)
</style>
