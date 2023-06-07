<template>
  <div class="q-pa-sm">
    <PartBanner
      :part="part"
    />
    <q-table
      :title="$t('iterable.history')"
      :columns="columns"
      :rows="partVersions"
      row-key="id"
      dense
      v-model:pagination="pagination"
      hide-pagination
      class="main-panel outer-max"
    >
      <template v-slot:body-cell-version="props">
        <q-td :props="props">
          <q-badge color="primary"
            @click="onVersionClicked(props.row as PartVersion)"
            class="clickable-badge"
          >
            v. {{ (props.row as PartVersion).version }}
          </q-badge>
        </q-td>
      </template>
      <!-- create date -->
      <template v-slot:body-cell-createDate="props">
        <q-td :props="props">
          {{ new Date((props.row as PartVersion).createDate).getDateStr() }}
          <q-tooltip>
            {{ new Date((props.row as PartVersion).createDate).toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- modified date -->
      <template v-slot:body-cell-updateDate="props">
        <q-td :props="props">
          {{ new Date((props.row as PartVersion).updateDate).getDateStr() }}
          <q-tooltip>
            {{ new Date((props.row as PartVersion).updateDate).toString() }}
          </q-tooltip>
        </q-td>
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
        :options="filteredPageOptions"
        hide-bottom-space
        dense
        @filter="filterFn"
        use-input
        style="width: 200px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { QSelect, QTableProps } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationResponse } from 'src/models/paginations/OffsetPaginationResponse';
import { partVersionService } from './services/PartVersionService';
import { PartVersion } from './models/PartVersion';
import { Part } from './models/Part';
import PartBanner from './components/PartBanner.vue';
import { partService } from './services/PartService';

const i18n = useI18n();

const router = useRouter();

const part = ref<Part>({} as Part);

const partVersions = ref<PartVersion[]>([]);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

/**
 * Pagination for API input
 */
const paginationInput = ref<OffsetPaginationInput>({
  page: 1,
  perPage: 20,
});

/**
 * Pagination data from API response
 */
const paginationResponse = ref<OffsetPaginationResponse>({
  page: 1,
  perPage: 20,
  total: 0,
  totalPages: 0,
});

const pagination = ref<QTableProps['pagination']>({
  rowsPerPage: 20,
});

const filteredPageOptions = ref<number[]>([]);

const pageOptions = computed(
  () => {
    const options: number[] = [];
    for (let i = 1; i <= paginationResponse.value.totalPages; i += 1) {
      options.push(i);
    }
    return options;
  },
);

function filterFn(val: string, update: (callbackFn: () => void,
  afterFn?: ((ref: QSelect) => void) | undefined) => void) {
  if (val === '') {
    update(() => {
      filteredPageOptions.value = pageOptions.value;
    });
    return;
  }
  update(() => {
    filteredPageOptions.value = pageOptions.value.filter((v) => v.toString().indexOf(val) > -1);
  });
}

const columns = computed(
  (): QTableProps['columns'] => [
    {
      name: 'version', label: i18n.t('iterable.version'), field: '', align: 'left', sortable: false, style: 'width: 300px;',
    },
    {
      name: 'createUser', label: i18n.t('base.creator'), field: 'createUser', align: 'left', sortable: false,
    },
    {
      name: 'createDate', label: i18n.t('base.createDate'), field: '', align: 'left', sortable: false,
    },
    {
      name: 'updateUser', label: i18n.t('base.modifier'), field: 'updateUser', align: 'left', sortable: false,
    },
    {
      name: 'updateDate', label: i18n.t('base.modifiedDate'), field: '', align: 'left', sortable: false,
    },
  ],
);

async function onVersionClicked(version: PartVersion) {
  router.push(`/parts/version/${version.id}/info`);
}

async function initialize() {
  const targetPart = await partService.getById(Number(props.id));
  if (targetPart) {
    part.value = targetPart;
  }
  const versionsPagination = await partVersionService
    .getPartVersions(Number(props.id), paginationInput.value);
  if (versionsPagination) {
    partVersions.value = versionsPagination.content
      .filter((version) => !version.checkout);
    paginationResponse.value = versionsPagination.pagination;
  }
}

watch(() => props.id, async () => {
  await initialize();
});

onBeforeMount(async () => {
  await initialize();
});
</script>

<style lang="sass" scoped>
.clickable-badge
  cursor: pointer

.outer-max
  height: calc(100vh - 175px)
</style>
