<template>
  <div class="q-pa-sm">
    <q-table
      :title="$t('parts.routing')"
      :columns="columns"
      :rows="routingsStore.records"
      row-key="id"
      dense
      v-model:pagination="pagination"
      hide-pagination
      class="main-panel outer-max"
    >
      <template v-slot:top>
        <div class="q-gutter-xs">
          <q-btn
            :label="$t('actions.add')"
            class="action-btn"
            @click="prompt = true"
          />
          <q-btn
            :label="$t('actions.delete')"
            class="action-btn"
          />
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
                  v-for="attr in attrLinksStore.attributes(SprmObjectType.PartVersion)"
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
      </template>
      <template v-slot:body-cell-actions="props">
        <q-btn
          dense
          round
          flat
          color="grey"
          icon="edit"
          size="12px"
          @click="onEditClicked(props.row as Routing)"
        />
        <q-btn
          dense
          round
          flat
          color="grey"
          icon="delete"
          size="12px"
        />
        <q-btn
          dense
          round
          flat
          color="grey"
          icon="info"
          size="12px"
          @click="onInfoClicked(props.row as Routing)"
        />
      </template>
      <template v-slot:body-cell-version="props">
        <q-td :props="props">
          <q-badge
            color="primary"
            class="clickable-badge"
          >
            v. {{ (props.row as Routing).version.version }}
          </q-badge>
        </q-td>
      </template>
      <!-- is checkout -->
      <template v-slot:body-cell-isCheckout="props">
        <q-td :props="props">
          <q-badge
            v-if="(props.row as Routing).checkout"
            color="orange"
            class="q-ml-sm"
          >
            {{ $t('actions.checkout') }}
          </q-badge>
        </q-td>
      </template>
      <!-- create date -->
      <template v-slot:body-cell-createDate="props">
        <q-td :props="props">
          {{ new Date((props.row as Routing).createDate).getDateStr() }}
          <q-tooltip>
            {{ new Date((props.row as Routing).createDate).toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <!-- modified date -->
      <template v-slot:body-cell-updateDate="props">
        <q-td :props="props">
          {{ new Date((props.row as Routing).updateDate).getDateStr() }}
          <q-tooltip>
            {{ new Date((props.row as Routing).updateDate).toString() }}
          </q-tooltip>
        </q-td>
      </template>
      <template v-slot:body-cell="props">
        <!-- display table value -->
        <q-td :props="props">
          {{props.value}}
        </q-td>
        <q-menu touch-position context-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section
                @click="onHistoryClicked((props.row as Routing))"
              >
                <div>
                  <q-icon name="history" color="primary"/>
                  {{ $t('iterable.history') }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="red-7" />
      </template>
    </q-table>
    <FilterPagination
      v-model="paginationInput"
      :response-pagination="paginationResponse"
    ></FilterPagination>
    <CreateRoutingDialog
      v-model="prompt"
      :part-id="Number(props.id)"
      @on-routing-created="onRoutingCreated"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { QSelect, QTableProps } from 'quasar';
import { useRouter } from 'vue-router';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationResponse } from 'src/models/paginations/OffsetPaginationResponse';
import FilterPagination from 'src/components/FilterPagination.vue';
import { Routing } from './models/Routing';
import { routingService } from './services/RoutingService';
import { useRoutingsStore } from './stores/RoutingsStore';
import { SprmObjectType } from '../objectTypes/models/ObjectType';
import { useAttributeLinksStore } from '../customs/stores/AttributeLinksStore';
import CreateRoutingDialog from './components/CreateRoutingDialog.vue';

const i18n = useI18n();

const attrLinksStore = useAttributeLinksStore();

const routingsStore = useRoutingsStore();

const router = useRouter();

const prompt = ref(false);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

const options = ref<number[]>([20, 50, 100]);

const canDisplay = ref<Record<string, boolean>>({} as Record<string, boolean>);

const displayMap = ref<Record<string, boolean>>({} as Record<string, boolean>);

const defaultColumns = computed(
  (): QTableProps['columns'] => [
    {
      name: 'actions', label: i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
    },
    {
      name: 'isCheckout', label: i18n.t('actions.checkout'), field: '', align: 'center', sortable: false,
    },
    {
      name: 'name', label: i18n.t('parts.routings.name'), field: 'name', align: 'left', sortable: true,
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
  ],
);

const columns = computed(
  (): QTableProps['columns'] => {
    const filteredColumns = defaultColumns.value?.filter((column) => displayMap.value[column.name]);
    attrLinksStore.attributes(SprmObjectType.RoutingVersion).forEach((attr) => {
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

/**
 * Pagination data for q-table
 */
const pagination = ref<QTableProps['pagination']>({
  rowsPerPage: 20,
});

async function initialize() {
  const fetchedRoutings = await routingService.getByPartId(Number(props.id), paginationInput.value);
  if (fetchedRoutings) {
    routingsStore.routings = fetchedRoutings.content;
    paginationResponse.value = fetchedRoutings.pagination;
  }
}

function onRoutingCreated(newRouting: Routing) {
  routingsStore.unshiftRouting(newRouting);
}

function onHistoryClicked(routing: Routing) {
  router.push(`/routings/${routing.id}/history`);
}

function onInfoClicked(routing: Routing) {
  router.push(`/routings/version/${routing.id}/info`);
}

function onEditClicked(routing: Routing) {
  router.push(`/routings/version/edit/${routing.id}/info`);
}

watch(() => props.id, async () => {
  await initialize();
});

onBeforeMount(async () => {
  await initialize();
  await Promise.all([
    attrLinksStore.initialize(SprmObjectType.RoutingVersion),
  ]);
  const attributes = attrLinksStore.attributes(SprmObjectType.RoutingVersion);
  attributes.forEach((attr) => {
    canDisplay.value[attr.number] = true;
  });
  defaultColumns.value?.forEach((column) => {
    displayMap.value[column.name] = true;
  });
});
</script>

<style lang="sass">
.highlight-menu
  color: white
  background: #026E81

.outer-max
  height: calc(100vh - 240px)

.avatar-color
  background: #FF9933
</style>
