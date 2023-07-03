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
      <q-tab name="usage" :label="$t('parts.usage')" />
      <q-tab name="info" :label="$t('parts.info')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
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
                    <div class="text-h6 q-mb-md">{{ $t('customs.attributes.title') }}</div>
                    <q-toggle
                      v-for="attr in attrLinksStore.attributes(sprmObjectType)"
                      v-bind:key="attr.number"
                      v-model="canDisplay[attr.number]"
                      :label="attr.languages[i18n.locale.value] || attr.name"
                    />
                  </div>
                </div>
              </q-btn-dropdown>
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
                size="12px"
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
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { QTableProps } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { useRoutingUsagesMapStore } from '../stores/RoutingUsagesMapStore';
import { routingUsageService } from '../services/RoutingUsageService';
import { RoutingUsage } from '../models/RoutingUsage';

const i18n = useI18n();

const routingUsagesMapStore = useRoutingUsagesMapStore();

const attrLinksStore = useAttributeLinksStore();

const tab = ref('usage');

const initializing = ref(true);

const canDisplay = ref<Record<string, boolean>>({} as Record<string, boolean>);

const displayMap = ref<Record<string, boolean>>({} as Record<string, boolean>);

const sprmObjectType = SprmObjectType.RoutingUsage;

const props = withDefaults(defineProps<{
  readonly: boolean,
  id: number | null,
}>(), {
  readonly: true,
});

const routingUsages = computed(
  () => {
    const children = routingUsagesMapStore.children(props.id);
    if (children) {
      return routingUsageService.toRecords(children);
    }
    return [];
  },
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
    attrLinksStore.attributes(sprmObjectType).forEach((attr) => {
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
  console.log(row.number);
}

onBeforeMount(async () => {
  initializing.value = true;
  await Promise.all([
    // partUsaeChildrenStore.partVersionInit(props.id),
    attrLinksStore.initialize(sprmObjectType),
  ]);
  const attributes = attrLinksStore.attributes(sprmObjectType);
  attributes.forEach((attr) => {
    canDisplay.value[attr.number] = true;
  });
  defaultColumns.value?.forEach((column) => {
    displayMap.value[column.name] = true;
  });
  initializing.value = false;
});
</script>
