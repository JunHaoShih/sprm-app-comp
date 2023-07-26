<template>
  <div class="q-pa-sm">
    <q-table
      :title="$t('iterable.history')"
      :columns="columns"
      :rows="routingVersions"
      row-key="id"
      dense
      v-model:pagination="pagination"
      hide-pagination
      class="main-panel outer-max sticky-header-table"
    >
      <template v-slot:body-cell-version="props">
        <q-td :props="props">
          <q-badge
            v-if="(props.row as RoutingVersion).isDraft"
            color="orange"
            @click="onVersionClicked(props.row as RoutingVersion)"
            class="clickable-badge"
          >
            v. {{ (props.row as RoutingVersion).version }} {{ $t('actions.draft') }}
          </q-badge>
          <q-badge
            v-else
            color="primary"
            @click="onVersionClicked(props.row as RoutingVersion)"
            class="clickable-badge"
          >
            v. {{ (props.row as RoutingVersion).version }}
          </q-badge>
        </q-td>
      </template>
      <!-- create date -->
      <template v-slot:body-cell-createDate="props">
        <q-td :props="props">
          {{ new Date((props.row as RoutingVersion).createDate).getDateStr() }}
          <q-tooltip>
            {{ new Date((props.row as RoutingVersion).createDate).toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- modified date -->
      <template v-slot:body-cell-updateDate="props">
        <q-td :props="props">
          {{ new Date((props.row as RoutingVersion).updateDate).getDateStr() }}
          <q-tooltip>
            {{ new Date((props.row as RoutingVersion).updateDate).toString() }}
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
import 'src/extensions/date.extensions';
import { RoutingVersion } from '../../../modules/routings/models/RoutingVersion';
import { routingVersionService } from '../../../modules/routings/services/RoutingVersionService';

const i18n = useI18n();

const router = useRouter();

const routingVersions = ref<RoutingVersion[]>([]);

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

async function onVersionClicked(version: RoutingVersion) {
  if (version.isDraft) {
    router.push(`/routings/version/edit/${version.id}/info`);
    return;
  }
  router.push(`/routings/version/${version.id}/info`);
}

async function initialize() {
  const versionsPagination = await routingVersionService
    .getRoutingVersions(Number(props.id), paginationInput.value);
  if (versionsPagination) {
    routingVersions.value = versionsPagination.content;
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
  height: calc(100vh - 280px)
</style>
