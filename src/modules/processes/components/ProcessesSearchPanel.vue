<template>
  <div>
    <!-- product files table -->
    <q-table
      title="Processes"
      :rows="processesStore.records"
      :class="props.tableClass"
      :columns="columns"
      v-model:selected="selected"
      :selection="props.selection"
      row-key="id"
      dense
      v-model:pagination="pagination"
      hide-pagination
      :loading="loading"
      style="position: sticky; top: 0"
    >
      <!-- button at table header -->
      <template v-slot:top>
        <div class="q-gutter-xs">
          <slot name="table-top"></slot>
          <!-- column display switch -->
          <q-btn-dropdown
            class="action-btn"
            :label="$t('columns.display')"
          >
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h7">{{ $t('columns.defaultColumn') }}</div>
                <q-toggle
                  v-for="column in defaultColumns"
                  v-bind:key="column.name"
                  v-model="displayMap[column.name]"
                  :label="column.label"
                />
                <div class="text-h7">{{ $t('customs.attributes.title') }}</div>
                <q-toggle
                  v-for="attr in attrLinksStore.attributes(processObjType)"
                  v-bind:key="attr.number"
                  v-model="canDisplay[attr.number]"
                  :label="attr.languages[i18n.locale.value] || attr.name"
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
        <q-space />
        <q-select
          class="q-mr-md"
          label="records per page"
          dense
          v-model="paginationInput.perPage"
          :options="options"
          style="min-width: 120px;"
        />
        <q-input
          v-model="patternInput"
          type="text"
          label="Search"
          dense
          v-on:keydown.enter.prevent="onSearchEnter"
        />
      </template>
      <!-- action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <slot name="row-actions" :part="(props.row as Process)"></slot>
        </q-td>
      </template>
      <!-- Process type -->
      <template v-slot:body-cell-processType="props">
        <q-td :props="props">
          {{ processesStore.displayProcessTypeName((props.row as Process)) }}
        </q-td>
      </template>
      <!-- Make type -->
      <template v-slot:body-cell-makeType="props">
        <q-td :props="props">
          {{ processesStore.displayMakeTypeName((props.row as Process)) }}
        </q-td>
      </template>
      <!-- create date -->
      <template v-slot:body-cell-createDate="props">
        <q-td :props="props">
          {{ new Date((props.row as Process).createDate).getDateStr() }}
          <q-tooltip>
            {{ (props.row as Process).createDate.toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- modified date -->
      <template v-slot:body-cell-updateDate="props">
        <q-td :props="props">
          {{ new Date((props.row as Process).updateDate).getDateStr() }}
          <q-tooltip>
            {{ (props.row as Process).updateDate.toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- context menu -->
      <template v-slot:body-cell="props">
        <!-- display table value -->
        <q-td :props="props">
          {{props.value}}
        </q-td>
        <slot name="cell-after" :part="(props.row as Process)"></slot>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="red-7" />
      </template>
    </q-table>
    <FilterPagination
      v-model="paginationInput"
      :response-pagination="paginationResponse"
    ></FilterPagination>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { QSelect, QTableProps } from 'quasar';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { OffsetPaginationResponse } from 'src/models/paginations/OffsetPaginationResponse';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import FilterPagination from 'src/components/FilterPagination.vue';
import { processTypeService } from 'src/modules/processTypes/services/ProcessTypeService';
import { makeTypeService } from 'src/modules/makeTypes/services/MakeTypeService';
import { ProcessType } from 'src/modules/processTypes/models/ProcessType';
import { MakeType } from 'src/modules/makeTypes/models/MakeType';
import 'src/extensions/date.extensions';
import { useProcessesStore } from '../stores/ProcessesStore';
import { Process } from '../models/Process';
import { processService } from '../services/ProcessService';

const i18n = useI18n();

const attrLinksStore = useAttributeLinksStore();

const processesStore = useProcessesStore();

const patternInput = ref('');

const loading = ref(false);

const processTypes = ref<ProcessType[]>([]);

const makeTypes = ref<MakeType[]>([]);

const canDisplay = ref<Record<string, boolean>>({} as Record<string, boolean>);

const displayMap = ref<Record<string, boolean>>({} as Record<string, boolean>);

const processObjType = SprmObjectType.Process;

interface Props {
  readonly: boolean;
  tableClass: string;
  selected?: Process[];
  selection: QTableProps['selection'],
  modelValue: string;
}
const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  tableClass: '',
  selected: () => [],
  modelValue: '',
  selection: 'none',
});

type Emit = {
  (e: 'update:modelValue', value: string): void
  (e: 'onSearch', value: string): void
  (e: 'update:selected', value: Process[] | undefined): void
}
const emit = defineEmits<Emit>();

const pattern = computed({
  get: (): string => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const selected = computed({
  get: () => props.selected,
  set: (value) => {
    emit('update:selected', value);
  },
});

const paginationInput = ref<OffsetPaginationInput>({
  page: 1,
  perPage: 20,
});

const paginationResponse = ref<OffsetPaginationResponse>({
  page: 1,
  perPage: 20,
  total: 0,
  totalPages: 0,
});

const options = ref<number[]>([20, 50, 100]);

const defaultColumns = computed(
  (): QTableProps['columns'] => [
    {
      name: 'actions', label: i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
    },
    {
      name: 'number', required: true, label: i18n.t('processes.number'), align: 'left', field: 'number', sortable: true,
    },
    {
      name: 'name', label: i18n.t('processes.name'), field: 'name', align: 'left', sortable: true,
    },
    {
      name: 'defaultImportTime', label: i18n.t('processes.defaultImportTime'), field: 'defaultImportTime', align: 'left', sortable: true,
    },
    {
      name: 'defaultExportTime', label: i18n.t('processes.defaultExportTime'), field: 'defaultExportTime', align: 'left', sortable: true,
    },
    {
      name: 'processType', label: i18n.t('processes.processType'), field: '', align: 'left', sortable: true,
    },
    {
      name: 'makeType', label: i18n.t('processes.makeType'), field: '', align: 'left', sortable: true,
    },
    {
      name: 'createUser', label: i18n.t('base.creator'), field: 'createUser', align: 'left', sortable: true,
    },
    {
      name: 'createDate', label: i18n.t('base.createDate'), field: '', align: 'left', sortable: true,
    },
    {
      name: 'updateUser', label: i18n.t('base.modifier'), field: 'updateUser', align: 'left', sortable: true,
    },
    {
      name: 'updateDate', label: i18n.t('base.modifiedDate'), field: '', align: 'left', sortable: true,
    },
  ],
);

const columns = computed(
  (): QTableProps['columns'] => {
    const filteredColumns = defaultColumns.value?.filter((column) => displayMap.value[column.name]);
    attrLinksStore.attributes(processObjType).forEach((attr) => {
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

const pagination = ref<QTableProps['pagination']>({
  rowsPerPage: 20,
});

function onSearchEnter(): void {
  pattern.value = patternInput.value;
  emit('onSearch', patternInput.value);
}

async function searchParts(): Promise<void> {
  loading.value = true;
  const processes = await processService.getByPattern(patternInput.value, paginationInput.value);
  if (processes) {
    processesStore.processes = processes.content;
    paginationResponse.value = processes.pagination;
    if (pagination.value?.rowsPerPage) {
      pagination.value.rowsPerPage = processes.pagination.perPage;
    }
  }
  selected.value.length = 0;
  loading.value = false;
}

async function updatePattern() {
  patternInput.value = pattern.value;
  await searchParts();
}

watch(paginationInput, async () => {
  await searchParts();
}, {
  deep: true,
});

watch(pattern, async () => {
  await updatePattern();
}, {
  deep: true,
});

/**
 * Initialize process types before mount
 */
async function initializeProcessTypes() {
  const fetchedProcessTypes = await processTypeService.getAll();
  if (fetchedProcessTypes) {
    processTypes.value = fetchedProcessTypes;
  }
}

/**
 * Initialize make types before mount
 */
async function initializeMakeTypes() {
  const fetchedMakeTypes = await makeTypeService.getAll();
  if (fetchedMakeTypes) {
    makeTypes.value = fetchedMakeTypes;
  }
}

onBeforeMount(async () => {
  await updatePattern();
  await Promise.all([
    attrLinksStore.initialize(processObjType),
    initializeProcessTypes(),
    initializeMakeTypes(),
  ]);
  const attributes = attrLinksStore.attributes(processObjType);
  attributes.forEach((attr) => {
    canDisplay.value[attr.number] = true;
  });
  defaultColumns.value?.forEach((column) => {
    displayMap.value[column.name] = true;
  });
});
</script>

<style lang="sass">
</style>
