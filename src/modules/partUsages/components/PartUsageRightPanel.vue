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
          :rows="partUsageChildren"
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
                      v-for="attr in attrLinksStore.attributes(ObjectTypeId.PartUsage)"
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
                @click="onEditClicked(props.row as PartUsageChild)"
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

      <q-tab-panel name="info">
        <PartInfoForm
          v-if="selectedPartVersion"
          :readonly="true"
          v-model="selectedPartVersion"
        />
        <div v-else class="row justify-center items-center">
          <span class="loader"></span>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog
      v-model="prompt"
      persistent
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card style="min-width: 700px">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ $t('parts.usages.edit') }}</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <PartUsageForm
            ref="formRef"
            v-model="modifiedUsage"
            :readonly="false"
            :on-submit="updateUsage"
          >
          </PartUsageForm>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
          <q-btn flat :label="$t('actions.edit')" @click="submit" ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { QTableProps, useQuasar } from 'quasar';
import PartInfoForm from '../../parts/components/PartInfoForm.vue';
import { usePartUsageTreeStore } from '../stores/PartUsageUsesStore';
import 'src/extensions/date.extensions';
import { PartVersion } from '../../parts/models/PartVersion';
import { partUsageService } from '../services/PartUsageService';
import { useAttributeLinksStore } from '../../customs/stores/AttributeLinksStore';
import { ObjectTypeId } from '../../objectTypes/models/ObjectType';
import PartUsageForm from './PartUsageForm.vue';
import { PartUsageChild } from '../models/PartUsageUses';
import { UpdatePartUsageDTO } from '../dtos/UpdatePartUsageDTO';

const $q = useQuasar();

const i18n = useI18n();

const partUsaeChildrenStore = usePartUsageTreeStore();

const attrLinksStore = useAttributeLinksStore();

const formRef = ref<InstanceType<typeof PartUsageForm>>();

const initializing = ref(true);

const canDisplay = ref<Record<string, boolean>>({} as Record<string, boolean>);

const displayMap = ref<Record<string, boolean>>({} as Record<string, boolean>);

const prompt = ref(false);

const modifiedUsage = ref<PartUsageChild>({} as PartUsageChild);

const props = withDefaults(defineProps<{
  readonly: boolean,
  id: number,
}>(), {
  readonly: true,
  id: 0,
});

const partUsageChildren = computed(
  () => {
    const children = partUsaeChildrenStore.children(props.id);
    if (children) {
      return partUsageService.toRecords(children);
    }
    return [];
  },
);

const selectedPartVersion = computed(
  (): PartVersion | undefined => partUsaeChildrenStore.partVersion(props.id),
);

const defaultColumns = computed(
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

const columns = computed(
  (): QTableProps['columns'] => {
    const filteredColumns = defaultColumns.value?.filter((column) => displayMap.value[column.name]);
    attrLinksStore.attributes(ObjectTypeId.PartUsage).forEach((attr) => {
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

watch(() => props.id, async () => {
  await partUsaeChildrenStore.partVersionInit(props.id);
});

const pagination: QTableProps['pagination'] = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
};

function onEditClicked(row: PartUsageChild) {
  modifiedUsage.value = row;
  prompt.value = true;
}

function submit() {
  formRef.value?.submit();
}

async function updateUsage() {
  const dto: UpdatePartUsageDTO = {
    quantity: modifiedUsage.value.quantity,
    remarks: modifiedUsage.value.remarks,
    customValues: modifiedUsage.value.customValues,
  };
  const success = await partUsageService.update(modifiedUsage.value.id, dto);
  if (success) {
    partUsaeChildrenStore.updateUsage(
      modifiedUsage.value.parentId,
      modifiedUsage.value.child.id,
      modifiedUsage.value,
    );
    $q.notify({
      message: i18n.t('actions.updates.success'),
      icon: 'check_circle',
      color: 'secondary',
    });
    prompt.value = false;
  }
}

onBeforeMount(async () => {
  initializing.value = true;
  await Promise.all([
    partUsaeChildrenStore.partVersionInit(props.id),
    attrLinksStore.initialize(ObjectTypeId.PartUsage),
  ]);
  const attributes = attrLinksStore.attributes(ObjectTypeId.PartUsage);
  attributes.forEach((attr) => {
    canDisplay.value[attr.number] = true;
  });
  defaultColumns.value?.forEach((column) => {
    displayMap.value[column.name] = true;
  });
  initializing.value = false;
});
const tab = ref('usage');
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 260px)
</style>
