<template>
  <div class="q-pa-sm">
    <!-- tabs -->
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="info" label="Info" />
        <q-tab name="dummy" label="Dummy" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="info">
          <q-table
            :rows="partUsageChildren"
            :columns="fileredColumns"
            row-key="key"
            dense
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

        <q-tab-panel name="dummy">
          <div class="text-h6">Dummy</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { QTableProps } from 'quasar';
import { usePartUsageChildrenStore } from './stores/PartUsageUsesStore';
import 'src/extensions/date.extensions';
import { PartUsageChild } from './models/PartUsageUses';

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
    const children = partUsaeChildrenStore.getChildren(1);
    return children || [];
  },
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

const tab = ref('info');
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 200px)
</style>
