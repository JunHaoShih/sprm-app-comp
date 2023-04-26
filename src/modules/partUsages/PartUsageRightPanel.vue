<template>
  <div>
    <!-- tabs -->
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
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
          :rows="partUsageChildren"
          :columns="fileredColumns"
          :pagination="pagination"
          row-key="key"
          dense
          class="outer-max"
          style="position: sticky; top: 0"
        >
          <!-- button at table header -->
          <template v-if="!readonly" v-slot:top>
            <q-btn color="primary" :label="$t('actions.add')"></q-btn>
            <q-btn color="primary" :label="$t('actions.delete')"></q-btn>
            <q-space />
          </template>
          <!-- action buttons -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn dense round flat
                color="grey" icon="edit"></q-btn>
              <q-btn dense round flat
                color="grey" icon="delete"></q-btn>
            </q-td>
          </template>
          <!-- child number -->
          <template v-slot:body-cell-usesNumber="props">
            <q-td :props="props">
              {{ props.row.uses.number }}
            </q-td>
          </template>
          <!-- child name -->
          <template v-slot:body-cell-usesName="props">
            <q-td :props="props">
              {{ props.row.uses.name }}
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="info">
        <part-info-panel
          v-if="partVersion"
          :readonly="true"
          v-model="partVersion"
        />
        <div v-else class="row justify-center items-center">
          <span class="loader"></span>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { QTableProps } from 'quasar';
import PartInfoPanel from '../parts/components/PartInfoPanel.vue';
import { usePartUsageChildrenStore } from './stores/PartUsageUsesStore';
import 'src/extensions/date.extensions';
import { PartUsageChild } from './models/PartUsageUses';
import { PartVersion } from '../parts/models/PartVersion';

const i18n = useI18n();

const partUsaeChildrenStore = usePartUsageChildrenStore();

const props = withDefaults(defineProps<{
  readonly: boolean,
  id: number,
}>(), {
  readonly: true,
  id: 0,
});

const partUsageChildren = computed(
  (): PartUsageChild[] => {
    const children = partUsaeChildrenStore.children(props.id);
    return children || [];
  },
);

const partVersion = computed(
  (): PartVersion | undefined => partUsaeChildrenStore.partVersion(props.id),
);

const columns = computed(
  (): QTableProps['columns'] => [
    {
      name: 'actions', label: i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
    },
    {
      name: 'usesNumber', required: true, label: i18n.t('parts.number'), align: 'left', field: '', sortable: true,
    },
    {
      name: 'usesName', required: true, label: i18n.t('parts.name'), align: 'left', field: '', sortable: true,
    },
    {
      name: 'quantity', label: i18n.t('quantity'), field: 'quantity', align: 'left', sortable: true,
    },
  ],
);

const fileredColumns = computed(
  (): QTableProps['columns'] => {
    if (props.readonly) {
      return columns.value?.filter((col) => col.name !== 'actions');
    }
    return columns.value;
  },
);

watch(() => props.id, async () => {
  await partUsaeChildrenStore.partVersionInit(props.id);
});

const pagination: QTableProps['pagination'] = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
};

onBeforeMount(async () => {
  await partUsaeChildrenStore.partVersionInit(props.id);
});
const tab = ref('usage');
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 260px)
</style>
