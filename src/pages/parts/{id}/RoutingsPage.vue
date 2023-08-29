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
      class="main-panel outer-max sticky-header-table"
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
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="edit"
            size="sm"
            @click="onEditClicked(props.row as Routing)"
          />
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="delete"
            size="sm"
          />
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="info"
            size="sm"
            :to="`/routings/version/${(props.row as Routing).version.id}/info`"
          />
        </q-td>
      </template>
      <!-- name -->
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <router-link
            :to="`/routings/version/${(props.row as Routing).version.id}/info`"
          >
            {{ (props.row as Routing).name }}
          </router-link>
        </q-td>
      </template>
      <!-- version -->
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
                @click="onEditClicked((props.row as Routing))"
              >
                <div>
                  <q-icon name="edit" color="primary"/>
                  {{ $t('actions.edit') }}
                </div>
              </q-item-section>
            </q-item>
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
            <q-item clickable v-close-popup>
              <q-item-section
                @click="onRoutingProcessClicked((props.row as Routing))"
              >
                <div>
                  <q-icon name="list" color="primary"/>
                  {{ $t('parts.routings.process') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item
              v-if="!(props.row as Routing).checkout"
              clickable v-close-popup
            >
              <q-item-section
                @click="onCheckOutClicked((props.row as Routing))"
              >
                <div>
                  <q-icon name="south_east" color="red"/>
                  {{ $t('actions.checkout') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item
              v-if="(props.row as Routing).checkout"
              clickable v-close-popup
            >
              <q-item-section
                @click="onCheckInClicked((props.row as Routing))"
              >
                <div>
                  <q-icon name="south_east" color="secondary"/>
                  {{ $t('actions.checkin') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item
              v-if="(props.row as Routing).checkout"
              clickable v-close-popup
            >
              <q-item-section
                @click="onDiscardClicked((props.row as Routing))"
              >
                <div>
                  <q-icon name="backspace" color="red"/>
                  {{ $t('actions.discard') }}
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
import { QSelect, QTableProps, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationResponse } from 'src/models/paginations/OffsetPaginationResponse';
import FilterPagination from 'src/components/FilterPagination.vue';
import ColumnDisplaySwitchPanel from 'src/components/ColumnDisplaySwitchPanel.vue';
import { Routing } from '../../../modules/routings/models/Routing';
import { routingService } from '../../../modules/routings/services/RoutingService';
import { useRoutingsStore } from '../../../modules/routings/stores/RoutingsStore';
import { useAttributeLinksStore } from '../../../modules/customs/stores/AttributeLinksStore';
import CreateRoutingDialog from '../../../modules/routings/components/CreateRoutingDialog.vue';
import { SprmObjectType } from '../../../modules/objectTypes/models/ObjectType';
import { CustomAttribute } from '../../../modules/customs/models/CustomAttribute';

const sprmObjectType = SprmObjectType.RoutingVersion;

const $q = useQuasar();

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

const attributes = ref<CustomAttribute[]>([]);

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

function onRoutingProcessClicked(routing: Routing) {
  router.push(`/routings/version/${routing.id}/usages`);
}

async function onCheckInClicked(routing: Routing): Promise<void> {
  const checkinRouting = await routingService.checkIn(routing.id);
  if (checkinRouting) {
    routingsStore.updateRouting(checkinRouting);
    $q.notify({
      type: 'success',
      message: i18n.t('actions.checkins.success'),
    });
  }
}

async function onCheckOutClicked(routing: Routing): Promise<Routing | null> {
  const checkoutRouting = await routingService.checkOut(routing.id);
  if (checkoutRouting) {
    routingsStore.updateRouting(checkoutRouting);
    $q.notify({
      type: 'success',
      message: i18n.t('actions.checkouts.success'),
    });
    return checkoutRouting;
  }
  return null;
}

function onDiscardClicked(routing: Routing): void {
  if (routing.draftId === routing.version.id) {
    $q.notify({
      type: 'error',
      message: i18n.t('actions.discards.cannotDiscardFirstVersion'),
    });
    return;
  }
  $q.dialog({
    dark: true,
    title: i18n.t('actions.discards.confirm'),
    message: i18n.t('actions.discards.dataLossWarning'),
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const discardRouting = await routingService.discard(routing.id);
    if (discardRouting) {
      routingsStore.updateRouting(discardRouting);
      $q.notify({
        type: 'success',
        message: i18n.t('actions.discards.success'),
      });
    }
  });
}

function onEditClicked(routing: Routing) {
  if (!routing.checkout) {
    $q.dialog({
      dark: true,
      title: i18n.t('actions.checkout'),
      message: i18n.t('parts.routings.wantToCheckOut'),
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      const checkoutRouting = await onCheckOutClicked(routing);
      if (checkoutRouting) {
        router.push(`/routings/version/edit/${checkoutRouting.draftId}/info`);
      }
    });
  } else {
    router.push(`/routings/version/edit/${routing.draftId}/info`);
  }
}

watch(() => props.id, async () => {
  await initialize();
});

onBeforeMount(async () => {
  await initialize();
  await Promise.all([
    attrLinksStore.initialize(sprmObjectType),
  ]);
  attributes.value = attrLinksStore.attributes(sprmObjectType);
  attributes.value.forEach((attr) => {
    canDisplay.value[attr.number] = true;
  });
  defaultColumns.value?.forEach((column) => {
    displayMap.value[column.name] = true;
  });
});
</script>

<style lang="sass" scoped>
.highlight-menu
  color: white
  background: #026E81

.outer-max
  height: calc(100vh - 265px)

.avatar-color
  background: #FF9933
</style>
