<template>
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
        <q-separator/>
        <div class="text-h7">{{ $t('customs.attributes.title') }}</div>
        <q-toggle
          v-for="attr in attributes"
          v-bind:key="attr.number"
          v-model="canDisplay[attr.number]"
          :label="attr.languages[locale] || attr.name"
        />
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { CustomAttribute } from 'src/modules/customs/models/CustomAttribute';
import { computed } from 'vue';

const props = defineProps<{
  defaultColumns: QTableProps['columns'],
  canDisplay: Record<string, boolean>,
  displayMap: Record<string, boolean>,
  attributes: CustomAttribute[],
  locale: string,
}>();

const canDisplay = computed(
  (): Record<string, boolean> => props.canDisplay,
);

const displayMap = computed(
  (): Record<string, boolean> => props.displayMap,
);

const attributes = computed(
  (): CustomAttribute[] => props.attributes,
);
</script>
