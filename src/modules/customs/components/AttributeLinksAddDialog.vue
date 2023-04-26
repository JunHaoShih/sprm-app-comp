<template>
  <q-dialog
    ref="dialogRef"
    v-model="prompt"
    persistent
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card style="min-width: 700px">
      <q-card-section class="bg-primary text-white row items-center">
        <div class="text-h6">{{ $t('customs.attributeLinks.new') }}</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll dialog-inner-max">
        <q-table
          :rows="filteredAttributes"
          :columns="columns"
          :pagination="pagination"
          v-model:selected="selected"
          selection="multiple"
          row-key="id"
          dense
        >
          <!-- table header -->
          <template v-slot:top>
            <q-space />
            <q-input v-model="patternInput" type="text" label="Search"
              v-on:keyup.enter="pattern = patternInput;"
            />
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
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="$t('actions.cancel')" v-close-popup />
        <q-btn flat :label="$t('actions.confirm')" @click="onConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { QDialog, QTableProps, useQuasar } from 'quasar';
import { CustomAttribute } from '../models/CustomAttribute';
import { useCustomAttributesStore } from '../stores/CustomAttributesStore';
import { useAttributeLinksStore } from '../stores/AttributeLinksStore';
import { useDisplayTypesStore } from '../stores/DisplayTypesStore';
import { attributeLinkService } from '../services/AttributeLinkService';

const i18n = useI18n();

const $q = useQuasar();

const customAttributesStore = useCustomAttributesStore();

const attrLinksStore = useAttributeLinksStore();

const displayTypesStore = useDisplayTypesStore();

const props = withDefaults(defineProps<{
  modelValue: boolean,
  excludedAttributes: CustomAttribute[],
  objectTypeId: number,
}>(), {
  modelValue: true,
  objectTypeId: 0,
  excludedAttributes: () => [] as CustomAttribute[],
});

type Emit = {
  (e: 'update:modelValue', value: boolean): void
}
const emit = defineEmits<Emit>();

const prompt = computed({
  get: (): boolean => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const dialogRef = ref<QDialog>({} as QDialog);

const selected = ref<CustomAttribute[]>([]);

const pattern = ref('');

const patternInput = ref('');

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

const filteredAttributes = computed(
  (): CustomAttribute[] => customAttributesStore.filteredAttributes(pattern.value)
    .filter((attr) => !props.excludedAttributes.find(
      (excluded) => excluded.id === attr.id,
    )),
);

onBeforeMount(async () => {
  await customAttributesStore.initialize();
});

watch(prompt, () => {
  selected.value = [];
  patternInput.value = '';
  pattern.value = '';
});

async function onConfirm(): Promise<void> {
  const attrIds = selected.value.map((attr): number => attr.id);
  const newLinks = await attributeLinkService.insert({
    objectTypeId: props.objectTypeId,
    attributeIds: attrIds,
  });
  if (!newLinks) {
    return;
  }
  newLinks.attributes.forEach((newLink) => attrLinksStore.addLink(newLink, props.objectTypeId));
  $q.notify({
    message: `${i18n.t('actions.inserts.success')}`,
    color: 'secondary',
  });
  dialogRef.value.hide();
}
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
