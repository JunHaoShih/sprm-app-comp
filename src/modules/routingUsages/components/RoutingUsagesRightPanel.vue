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
              <ColumnDisplaySwitchPanel
                :locale="i18n.locale.value"
                :attributes="attributes"
                :can-display="canDisplay"
                :display-map="displayMap"
                :default-columns="defaultColumns">
              </ColumnDisplaySwitchPanel>
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
import { CustomAttribute } from 'src/modules/customs/models/CustomAttribute';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import ColumnDisplaySwitchPanel from 'src/components/ColumnDisplaySwitchPanel.vue';
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

const attributes = ref<CustomAttribute[]>([]);

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

function onEditClicked(row: RoutingUsage) {
  console.log(row.number);
}

onBeforeMount(async () => {
  initializing.value = true;
  await Promise.all([
    // partUsaeChildrenStore.partVersionInit(props.id),
    attrLinksStore.initialize(sprmObjectType),
  ]);
  attributes.value = attrLinksStore.attributes(sprmObjectType);
  attributes.value.forEach((attr) => {
    canDisplay.value[attr.number] = true;
  });
  defaultColumns.value?.forEach((column) => {
    displayMap.value[column.name] = true;
  });
  initializing.value = false;
});
</script>
