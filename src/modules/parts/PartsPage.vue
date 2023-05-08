<template>
  <div class="q-pa-sm">
    <!-- product files table -->
    <q-table
      title="Parts"
      :rows="partsStore.records"
      :columns="columns"
      v-model:selected="selected"
      selection="multiple"
      row-key="id"
      class="center-max outer-max main-panel"
      dense
      :pagination="pagination"
      style="position: sticky; top: 0"
    >
      <!-- button at table header -->
      <template v-slot:top>
        <q-btn color="primary" :label="$t('actions.add')" @click="prompt=true"></q-btn>
        <q-btn color="primary" :label="$t('actions.delete')"></q-btn>
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
        <q-input v-model="patternInput" type="text" label="Search"
          v-on:keyup.enter="onSearchEnter"
        />
      </template>
      <!-- action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="edit"
            @click="onEditClicked(props.row as Part)"
          />
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="delete"
          />
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="info"
            @click="onInfoClicked(props.row as Part)"
          />
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
    </q-table>
    <PartDialog v-model="prompt" @onPartCreated="onPartCreated"></PartDialog>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import {
  LocationQueryValue, onBeforeRouteUpdate, useRoute, useRouter,
} from 'vue-router';
import { QTableProps } from 'quasar';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import PartDialog from './components/PartDialog.vue';
import { partService } from './services/PartService';
import { usePartsStore } from './stores/PartsStore';
import { Part, ViewType } from './models/Part';
import { ObjectTypeId } from '../objectTypes/models/ObjectType';
import 'src/extensions/date.extensions';

const i18n = useI18n();

const route = useRoute();

const router = useRouter();

const attrLinksStore = useAttributeLinksStore();

const partsStore = usePartsStore();

const patternInput = ref('');

const pattern = ref('');

const selected = ref<Part[]>([]);

const prompt = ref(false);

const canDisplay = ref<Record<string, boolean>>({} as Record<string, boolean>);

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

const pagination: QTableProps['pagination'] = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
};

function onInfoClicked(part: Part): void {
  router.push(`parts/version/${part.version.id}/info`);
}

function onEditClicked(part: Part): void {
  if (!part.checkout) {
    // TODO show dialog to checkout
  }
  // router.push(`parts/${part.id}/info`);
  router.push(`parts/version/edit/${part.version.id}/info`);
}

function onSearchEnter(): void {
  router.push({
    path: '/parts',
    query: { pattern: patternInput.value },
  });
}

function onPartCreated(newPart: Part) {
  partsStore.unshiftPart(newPart);
}

async function searchParts(): Promise<void> {
  const parts = await partService.getByPattern(patternInput.value);
  if (parts) {
    partsStore.parts = parts;
  }
}

function updatePattern(queryValue: LocationQueryValue | LocationQueryValue[]) {
  const newPattern = Array.isArray(queryValue)
    ? queryValue[0] === null ? '' : queryValue[0]
    : queryValue === null ? '' : queryValue;
  patternInput.value = newPattern;
  pattern.value = newPattern;
}

onBeforeRouteUpdate((to) => {
  updatePattern(to.query.pattern);
});

watch(pattern, async () => {
  await searchParts();
});

onBeforeMount(async () => {
  updatePattern(route.query.pattern);
  await Promise.all([
    attrLinksStore.initialize(ObjectTypeId.PartVersion),
  ]);
  const attributes = attrLinksStore.attributes(ObjectTypeId.PartVersion);
  attributes.forEach((attr) => {
    canDisplay.value[attr.number] = true;
  });
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 70px)
</style>
