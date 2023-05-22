<template>
  <div>
    <!-- product files table -->
    <q-table
      title="Parts"
      :rows="partsStore.records"
      :class="props.tableClass"
      :columns="columns"
      v-model:selected="selected"
      selection="multiple"
      row-key="id"
      dense
      v-model:pagination="pagination"
      hide-pagination
      :loading="loading"
      style="position: sticky; top: 0"
    >
      <!-- button at table header -->
      <template v-slot:top>
        <slot name="table-top"></slot>
        <q-btn-dropdown
          color="primary"
          :label="$t('columns.display')"
        >
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 q-mb-md">{{ $t('customs.attributes.title') }}</div>
              <q-toggle
                v-for="attr in attrLinksStore.attributes(ObjectTypeId.PartVersion)"
                v-bind:key="attr.number"
                v-model="canDisplay[attr.number]"
                :label="attr.languages[i18n.locale.value] || attr.name"
              />
            </div>
          </div>
        </q-btn-dropdown>
        <q-space />
        <q-select
          class="q-mr-md"
          label="records per page"
          dense
          v-model="paginationInput.perPage"
          :options="options"
          style="min-width: 120px;"
        />
        <q-input v-model="patternInput" type="text" label="Search"
          dense
          v-on:keyup.enter="onSearchEnter"
        />
      </template>
      <!-- action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <slot name="row-actions" :part="(props.row as Part)"></slot>
        </q-td>
      </template>
      <!-- is checkout -->
      <template v-slot:body-cell-isCheckout="props">
        <q-td :props="props">
          <q-icon v-if="props.row.checkout" name="warning" color="orange" size="8px">
            <q-tooltip>
              {{ $t('iterable.checkout') }}
            </q-tooltip>
          </q-icon>
        </q-td>
      </template>
      <!-- version -->
      <template v-slot:body-cell-version="props">
        <q-td :props="props">
          {{ partsStore.getVersion(props.row.version) }}
        </q-td>
      </template>
      <!-- view -->
      <template v-slot:body-cell-view="props">
        <q-td v-if="props.row.viewType === ViewType.Design" :props="props">
          {{ $t('parts.views.design') }}
        </q-td>
        <q-td v-else :props="props">
          {{ $t('parts.views.manufacturing') }}
        </q-td>
      </template>
      <!-- create date -->
      <template v-slot:body-cell-createDate="props">
        <q-td :props="props">
          {{ new Date(props.row.version.createDate).getDateStr() }}
          <q-tooltip>
            {{ new Date(props.row.version.createDate).toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- modified date -->
      <template v-slot:body-cell-updateDate="props">
        <q-td :props="props">
          {{ new Date(props.row.version.updateDate).getDateStr() }}
          <q-tooltip>
            {{ new Date(props.row.version.updateDate).toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- context menu -->
      <template v-slot:body-cell="props">
        <!-- display table value -->
        <q-td :props="props">
          {{props.value}}
        </q-td>
        <q-menu touch-position context-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>{{ $t('actions.edit') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>{{ $t('actions.delete') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>{{ $t('parts.routing') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="red-7" />
      </template>
    </q-table>
    <div class="q-pt-sm flex flex-center">
      <q-pagination
        v-model="paginationInput.page"
        color="grey-7"
        :max="paginationResponse.totalPages"
        max-pages="6"
        direction-links
        boundary-links
        active-color="primary"
      />
      <q-select
        v-model="paginationInput.page"
        :options="pageOptions"
        hide-bottom-space
        dense
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { QTableProps } from 'quasar';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { OffsetPaginationResponse } from 'src/models/paginations/OffsetPaginationResponse';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { partService } from '../services/PartService';
import { usePartsStore } from '../stores/PartsStore';
import { Part, ViewType } from '../models/Part';
import 'src/extensions/date.extensions';

const i18n = useI18n();

const attrLinksStore = useAttributeLinksStore();

const partsStore = usePartsStore();

const patternInput = ref('');

const loading = ref(false);

const canDisplay = ref<Record<string, boolean>>({} as Record<string, boolean>);

interface Props {
  readonly: boolean;
  tableClass: string;
  selected?: Part[];
  modelValue: string;
}
const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  tableClass: '',
  selected: () => [],
  modelValue: '',
});

type Emit = {
  (e: 'update:modelValue', value: string): void
  (e: 'onSearch', value: string): void
  (e: 'update:selected', value: Part[] | undefined): void
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

const pageOptions = computed(
  () => {
    const options: number[] = [];
    for (let i = 1; i <= paginationResponse.value.totalPages; i += 1) {
      options.push(i);
    }
    return options;
  },
);

const options = ref<number[]>([20, 50, 100]);

const columns = computed(
  (): QTableProps['columns'] => {
    const defaultColumns: QTableProps['columns'] = [
      {
        name: 'actions', label: i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
      },
      {
        name: 'isCheckout', label: '', field: '', align: 'left', sortable: false,
      },
      {
        name: 'number', required: true, label: i18n.t('parts.number'), align: 'left', field: 'number', sortable: true,
      },
      {
        name: 'name', label: i18n.t('parts.name'), field: 'name', align: 'left', sortable: true,
      },
      {
        name: 'view', label: i18n.t('parts.view'), field: '', align: 'left', sortable: true,
      },
      {
        name: 'version', label: i18n.t('iterable.version'), field: '', align: 'left', sortable: true,
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
    ];
    attrLinksStore.attributes(ObjectTypeId.PartVersion).forEach((attr) => {
      if (!canDisplay.value[attr.number]) {
        return;
      }
      const currentLabel = attr.languages[i18n.locale.value] || attr.name;
      defaultColumns.push({
        name: attr.number,
        label: currentLabel,
        field: attr.number,
        align: 'left',
        sortable: true,
      });
    });
    return defaultColumns;
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
  const parts = await partService.getByPattern(patternInput.value, paginationInput.value);
  if (parts) {
    partsStore.parts = parts.content;
    paginationResponse.value = parts.pagination;
    if (pagination.value && pagination.value.rowsPerPage) {
      pagination.value.rowsPerPage = parts.pagination.perPage;
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

onBeforeMount(async () => {
  await updatePattern();
  await Promise.all([
    attrLinksStore.initialize(ObjectTypeId.PartVersion),
  ]);
  const attributes = attrLinksStore.attributes(ObjectTypeId.PartVersion);
  attributes.forEach((attr) => {
    canDisplay.value[attr.number] = true;
  });
});
</script>

<style lang="sass">
</style>
