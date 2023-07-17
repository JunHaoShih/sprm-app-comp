<template>
  <div class="q-pa-sm">
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
          <q-badge
            v-if="(props.row as PartVersion).isDraft"
            color="orange"
            @click="onVersionClicked(props.row as PartVersion)"
            class="clickable-badge"
          >
            v. {{ (props.row as PartVersion).version }} {{ $t('actions.draft') }}
          </q-badge>
          <q-badge
            v-else
            color="primary"
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
import { QTableProps } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationResponse } from 'src/models/paginations/OffsetPaginationResponse';
import FilterPagination from 'src/components/FilterPagination.vue';
import { partVersionService } from './services/PartVersionService';
import { PartVersion } from './models/PartVersion';
import 'src/extensions/date.extensions';

const i18n = useI18n();

const router = useRouter();

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
  if (version.isDraft) {
    router.push(`/parts/version/edit/${version.id}/info`);
    return;
  }
  router.push(`/parts/version/${version.id}/info`);
}

async function initialize() {
  const versionsPagination = await partVersionService
    .getPartVersions(Number(props.id), paginationInput.value);
  if (versionsPagination) {
    partVersions.value = versionsPagination.content;
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
  height: calc(100vh - 290px)
</style>
