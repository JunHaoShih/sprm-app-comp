<template>
  <div>
    <PopupDialog
      v-model="prompt"
      :title="$t('parts.usages.new')"
    >
      <template v-slot:center>
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          animated
          header-nav
        >
          <q-step
            :name="1"
            :title="$t('parts.search')"
            icon="settings"
            :done="isSearchPageDone"
            :header-nav="isSearchPageDone"
          >
            <PartsSearchPanel
              v-if="createType === 'search'"
              v-model="pattern"
              :readonly="true"
              v-model:selected="selected"
              selection="single"
              class="main-panel"
              table-class="dialog-stepper-table"
            />
            <q-scroll-area
              v-if="createType === 'create'"
              class="dialog-inner-max" visible
            >
              <CreatePartForm
                ref="formRef"
                :on-success="onPartCreated"
              />
          </q-scroll-area>
          </q-step>
          <q-step
            :name="2"
            :title="$t('parts.usages.new')"
            icon="data_usage"
            :header-nav="isUsagePageDone"
          >
            <q-scroll-area class="dialog-inner-max" visible>
              <CreatePartUsageForm
                ref="createPartUsageForm"
                :on-success="usageCreated"
                :parent-part-version-id="selectedPartVersionId"
                :part-child="selectedSinglePart"
                :readonly="false"
                class="main-panel"
              />
            </q-scroll-area>
          </q-step>
        </q-stepper>
      </template>
      <template v-slot:bottom>
        <div v-if="isSearchPage">
          <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
          <q-btn flat :label="$t('actions.next')" @click="onNextStep"></q-btn>
        </div>
        <div v-if="isUsagePage">
          <q-btn flat :label="$t('actions.previous')" @click="stepper.previous()"></q-btn>
          <q-btn flat :label="$t('actions.add')" @click="submit"></q-btn>
        </div>
      </template>
    </PopupDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { QStepper, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import CreatePartForm from 'src/modules/parts/components/CreatePartForm.vue';
import PartsSearchPanel from 'src/modules/parts/components/PartsSearchPanel.vue';
import { Part } from 'src/modules/parts/models/Part';
import PopupDialog from 'src/components/PopupDialog.vue';
import CreatePartUsageForm from './CreatePartUsageForm.vue';
import { usePartUsageTreeStore } from '../stores/PartUsageUsesStore';
import { PartUsageChild } from '../models/PartUsageUses';

export type CreateType = 'create' | 'search' | 'none';

const $q = useQuasar();

const i18n = useI18n();

const partUsaeChildrenStore = usePartUsageTreeStore();

const step = ref(1);

const pattern = ref('');

const selected = ref<Part[]>([]);

const formRef = ref<InstanceType<typeof CreatePartForm>>();

const createPartUsageForm = ref<InstanceType<typeof CreatePartUsageForm>>();

const selectedSinglePart = computed(
  (): Part => {
    if (selected.value.length === 0) {
      return {} as Part;
    }
    return selected.value[0];
  },
);

const isSearchPage = computed(
  (): boolean => step.value === 1,
);

const isSearchPageDone = computed(
  (): boolean => step.value > 1,
);

const isUsagePage = computed(
  (): boolean => step.value === 2,
);

const isUsagePageDone = computed(
  (): boolean => step.value > 2,
);

const stepper = ref<QStepper>({} as QStepper);

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  modelValue: boolean,
  selectedPartVersionId: number,
  createType?: CreateType,
}>(), {
  modelValue: false,
  selectedPartVersionId: 0,
  createType: 'search',
});

type Emit = {
  (e: 'update:modelValue', value: boolean): void
}
const emit = defineEmits<Emit>();

const prompt = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

watch(prompt, () => {
  if (prompt.value) {
    step.value = 1;
  }
});

async function onSelectDone(): Promise<void> {
  if (selected.value.length !== 1) {
    $q.notify({
      message: i18n.t('parts.mustSelectOne'),
      color: 'red',
      icon: 'error',
    });
    return;
  }
  const selectedPart: Part = selected.value[0];
  if (selectedPart.version.id === props.selectedPartVersionId) {
    $q.notify({
      message: i18n.t('parts.usages.selfAddNotAllowed'),
      color: 'red',
      icon: 'error',
    });
    return;
  }
  stepper.value.next();
}

function submit() {
  createPartUsageForm.value?.submit();
}

function onPartCreated(newPart: Part): void {
  selected.value.length = 0;
  selected.value.push(newPart);
  stepper.value.next();
}

async function onNextStep(): Promise<void> {
  if (props.createType === 'create') {
    formRef.value?.submit();
  } else {
    onSelectDone();
  }
}

async function usageCreated(usages: PartUsageChild[]) {
  partUsaeChildrenStore.addUses(usages, props.selectedPartVersionId);
  $q.notify({
    message: i18n.t('actions.inserts.success'),
    color: 'secondary',
    icon: 'check_circle',
  });
  prompt.value = false;
}
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 250px)

.my-custom-paddding
  .q-stepper
    &__tab
      min-width: none
</style>
