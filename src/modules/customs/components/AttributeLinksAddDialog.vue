<template>
  <PopupDialog
    v-model="prompt"
    :title="$t('customs.attributeLinks.new')"
  >
    <template v-slot:center>
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
    </template>
    <template v-slot:bottom>
      <q-btn flat :label="$t('actions.cancel')" v-close-popup />
      <q-btn flat :label="$t('actions.confirm')" @click="onConfirm" />
    </template>
  </PopupDialog>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { QTableProps, useQuasar } from 'quasar';
import PopupDialog from 'src/components/PopupDialog.vue';
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
    type: 'success',
    message: `${i18n.t('actions.inserts.success')}`,
  });
  prompt.value = false;
}
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
