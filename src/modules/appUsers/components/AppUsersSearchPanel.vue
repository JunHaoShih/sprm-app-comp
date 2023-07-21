<template>
  <div>
    <!-- product files table -->
    <q-table
      title="AppUsers"
      :rows="usersStore.records"
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
          <ColumnDisplaySwitchPanel
            :locale="i18n.locale.value"
            :attributes="attributes"
            :can-display="canDisplay"
            :display-map="displayMap"
            :default-columns="defaultColumns">
          </ColumnDisplaySwitchPanel>
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
          <slot name="row-actions" :appUser="(props.row as AppUser)"></slot>
        </q-td>
      </template>
      <!-- is admin display -->
      <template v-slot:body-cell-isAdmin="props">
        <q-td :props="props">
          <q-icon
            v-if="(props.row as AppUser).isAdmin"
            name="check_circle"
            color="green"
            size="18px"
          />
        </q-td>
      </template>
      <!-- create date -->
      <template v-slot:body-cell-createDate="props">
        <q-td :props="props">
          {{ new Date((props.row as AppUser).createDate).getDateStr() }}
          <q-tooltip>
            {{ (props.row as AppUser).createDate.toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- modified date -->
      <template v-slot:body-cell-updateDate="props">
        <q-td :props="props">
          {{ new Date((props.row as AppUser).updateDate).getDateStr() }}
          <q-tooltip>
            {{ (props.row as AppUser).updateDate.toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- context menu -->
      <template v-slot:body-cell="props">
        <!-- display table value -->
        <q-td :props="props">
          {{props.value}}
        </q-td>
        <slot name="cell-after" :appUser="(props.row as AppUser)"></slot>
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
import { QTableProps } from 'quasar';
import { CustomAttribute } from 'src/modules/customs/models/CustomAttribute';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationResponse } from 'src/models/paginations/OffsetPaginationResponse';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import FilterPagination from 'src/components/FilterPagination.vue';
import ColumnDisplaySwitchPanel from 'src/components/ColumnDisplaySwitchPanel.vue';
import { useUsersStore } from '../stores/AppUsersStore';
import { AppUser } from '../models/AppUser';
import { appUserService } from '../services/AppUserService';
import 'src/extensions/date.extensions';

const objectType = SprmObjectType.AppUser;

const i18n = useI18n();

const attrLinksStore = useAttributeLinksStore();

const usersStore = useUsersStore();

const patternInput = ref('');

const loading = ref(false);

const canDisplay = ref<Record<string, boolean>>({} as Record<string, boolean>);

const displayMap = ref<Record<string, boolean>>({} as Record<string, boolean>);

const attributes = ref<CustomAttribute[]>([]);

interface Props {
  readonly: boolean;
  tableClass: string;
  selected?: AppUser[];
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
  (e: 'update:selected', value: AppUser[] | undefined): void
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
      name: 'username', required: true, label: i18n.t('users.username'), field: 'username', align: 'left', sortable: true,
    },
    {
      name: 'fullName', required: true, label: i18n.t('users.fullName'), field: 'fullName', align: 'left', sortable: true,
    },
    {
      name: 'isAdmin', required: true, label: i18n.t('users.isAdmin'), field: 'isAdmin', align: 'center', sortable: true,
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

const pagination = ref<QTableProps['pagination']>({
  rowsPerPage: 20,
});

function onSearchEnter(): void {
  pattern.value = patternInput.value;
  emit('onSearch', patternInput.value);
}

async function searchAppUsers(): Promise<void> {
  loading.value = true;
  const appUsers = await appUserService.getByPattern(patternInput.value, paginationInput.value);
  if (appUsers) {
    usersStore.appUsers = appUsers.content;
    paginationResponse.value = appUsers.pagination;
    if (pagination.value?.rowsPerPage) {
      pagination.value.rowsPerPage = appUsers.pagination.perPage;
    }
  }
  selected.value.length = 0;
  loading.value = false;
}

async function updatePattern() {
  patternInput.value = pattern.value;
  await searchAppUsers();
}

watch(paginationInput, async () => {
  await searchAppUsers();
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
    attrLinksStore.initialize(objectType),
  ]);
  attributes.value = attrLinksStore.attributes(objectType);
  attributes.value.forEach((attr) => {
    canDisplay.value[attr.number] = true;
  });
  defaultColumns.value?.forEach((column) => {
    displayMap.value[column.name] = true;
  });
});
</script>
