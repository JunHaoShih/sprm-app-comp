<template>
  <div>
    <q-table
      dense
      :title="$t('customs.attributeLinks.title')"
      :rows="targetAttributes"
      :columns="columns"
      :pagination="pagination"
      v-model:selected="selectedAttributes"
      selection="multiple"
      row-key="id"
      class="outer-max q-pa-sm sticky-header-table"
      style="position: sticky; top: 0"
    >
      <!-- button at table header -->
      <template v-slot:top>
        <div class="q-gutter-xs">
          <q-btn
            class="action-btn"
            :label="$t('actions.add')"
            @click="searchPrompt = !searchPrompt"
          />
          <q-btn
            class="action-btn"
            :label="$t('actions.delete')"
            @click="onMultiDelete"
          />
          <q-space />
        </div>
      </template>
      <!-- action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="delete"
            size="sm"
            @click="onSingleDelete(props.row as CustomAttribute)"
          />
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="info"
            size="sm"
            @click="onInfoClicked(props.row as CustomAttribute)" />
        </q-td>
      </template>
      <!-- display type -->
      <template v-slot:body-cell-displayType="props">
        <q-td :props="props">
          {{
            displayTypesStore.getOption(props.row.displayType).label
          }}
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="viewPrompt" persistent
      transition-show="rotate" transition-hide="rotate">
      <q-card style="min-width: 700px">
        <q-card-section class="bg-dark text-white row items-center">
          <div class="text-h6">{{ $t('customs.attributes.title') }}</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll dialog-inner-max">
          <CustomAttributeForm
            v-model="viewedCustomAttribute"
            :readonly="true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <AttributeLinksAddDialog
      v-model="searchPrompt"
      :excludedAttributes="targetAttributes"
      :objectTypeId="props.objectTypeId"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { QDialog, QTableProps, useQuasar } from 'quasar';
import AttributeLinksAddDialog from './AttributeLinksAddDialog.vue';
import CustomAttributeForm from './CustomAttributeForm.vue';
import { CustomAttribute } from '../models/CustomAttribute';
import { useAttributeLinksStore } from '../stores/AttributeLinksStore';
import { useDisplayTypesStore } from '../stores/DisplayTypesStore';
import { attributeLinkService } from '../services/AttributeLinkService';

const i18n = useI18n();

const $q = useQuasar();

const attrLinksStore = useAttributeLinksStore();

const displayTypesStore = useDisplayTypesStore();

const viewPrompt = ref(false);

const searchPrompt = ref(false);

const viewedCustomAttribute = ref<CustomAttribute>({} as CustomAttribute);

const selectedAttributes = ref<CustomAttribute[]>([]);

const props = withDefaults(defineProps<{
  objectTypeId: number,
}>(), {
  objectTypeId: 0,
});

const targetAttributes = computed(
  (): CustomAttribute[] => attrLinksStore.attributes(props.objectTypeId),
);

const columns = computed(
  (): QTableProps['columns'] => [
    {
      name: 'actions', label: i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
    },
    {
      name: 'number', required: true, label: i18n.t('customs.generic.number'), align: 'left', field: 'number', sortable: true,
    },
    {
      name: 'name', label: i18n.t('customs.generic.name'), field: 'name', align: 'left', sortable: true,
    },
    {
      name: 'displayType', label: i18n.t('customs.attributes.displayType'), field: '', align: 'left', sortable: true,
    },
  ],
);

const pagination: QTableProps['pagination'] = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
};

async function reloadPanel(): Promise<void> {
  $q.loading.show({
    delay: 400,
  });
  await attrLinksStore.initialize(props.objectTypeId);
  $q.loading.hide();
}

watch(() => props.objectTypeId, () => {
  reloadPanel();
});

function onInfoClicked(attribute: CustomAttribute): void {
  viewedCustomAttribute.value = attribute;
  viewPrompt.value = true;
}

async function onSingleDelete(attribute: CustomAttribute) {
  $q.dialog({
    title: i18n.t('actions.delete'),
    message: `${i18n.t('actions.deletes.confirm')} ${attribute.number} ?`,
    cancel: i18n.t('actions.cancel'),
    persistent: true,
  }).onOk(async () => {
    const code = await attributeLinkService.deleteMultiple({
      objectTypeId: props.objectTypeId,
      attributeIds: [attribute.id],
    });
    if (code === 0) {
      attrLinksStore.deleteLinks([attribute], props.objectTypeId);
      $q.notify({
        type: 'success',
        message: i18n.t('actions.deletes.success'),
      });
    }
  });
}

async function onMultiDelete(): Promise<void> {
  if (selectedAttributes.value.length === 0) {
    $q.notify({
      type: 'error',
      message: i18n.t('actions.deletes.atLeastOne'),
    });
    return;
  }
  $q.dialog({
    title: i18n.t('actions.delete'),
    message: `${i18n.t('actions.deletes.confirm')} (${selectedAttributes.value.length}) ?`,
    cancel: i18n.t('actions.cancel'),
    persistent: true,
  }).onOk(async () => {
    const code = await attributeLinkService.deleteMultiple({
      objectTypeId: props.objectTypeId,
      attributeIds: selectedAttributes.value.map((attr) => attr.id),
    });
    if (code === 0) {
      attrLinksStore.deleteLinks(selectedAttributes.value, props.objectTypeId);
      selectedAttributes.value.length = 0;
      $q.notify({
        type: 'success',
        message: i18n.t('actions.deletes.success'),
      });
    }
  });
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 155px)
</style>
