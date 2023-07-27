<template>
  <div>
    <PopupDialog
      v-model="prompt"
      :title="$t('parts.routings.processes.new')"
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
            :title="$t('processes.search')"
            icon="settings"
            :done="isSearchPageDone"
            :header-nav="isSearchPageDone"
          >
            <ProcessesSearchPanel
              v-if="createType === 'search'"
              v-model="pattern"
              :readonly="true"
              v-model:selected="selected"
              selection="single"
              class="main-panel"
              table-class="dialog-stepper-table"
            />
          </q-step>
          <q-step
            :name="2"
            :title="$t('parts.routings.processes.new')"
            icon="data_usage"
            :header-nav="isUsagePageDone"
          >
            <q-scroll-area class="dialog-inner-max" visible>
              <CreateRoutingUsageForm
                ref="createRoutingUsageForm"
                :on-success="usageCreated"
                :default-number="generatedNumber"
                :parent-usage-id="selectedParentUsageId"
                :root-routing-version-id="rootVersionId"
                :process="selectedSingleProcess"
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
import { Process } from 'src/modules/processes/models/Process';
import PopupDialog from 'src/components/PopupDialog.vue';
import ProcessesSearchPanel from 'src/modules/processes/components/ProcessesSearchPanel.vue';
import { useRoutingUsagesMapStore } from '../stores/RoutingUsagesMapStore';
import CreateRoutingUsageForm from './CreateRoutingUsageForm.vue';
import { RoutingUsage } from '../models/RoutingUsage';

export type CreateType = 'create' | 'search' | 'none';

const $q = useQuasar();

const i18n = useI18n();

const routingUsagesMapStore = useRoutingUsagesMapStore();

const step = ref(1);

const pattern = ref('');

const selected = ref<Process[]>([]);

const generatedNumber = ref('');

const createRoutingUsageForm = ref<InstanceType<typeof CreateRoutingUsageForm>>();

const selectedSingleProcess = computed(
  (): Process => {
    if (selected.value.length === 0) {
      return {} as Process;
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
  selectedParentUsageId: number | null,
  rootVersionId: number,
  createType?: CreateType,
}>(), {
  modelValue: false,
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
      type: 'error',
      message: i18n.t('parts.mustSelectOne'),
    });
    return;
  }
  generatedNumber.value = routingUsagesMapStore.nextNumber;
  stepper.value.next();
}

function submit() {
  createRoutingUsageForm.value?.submit();
}

async function onNextStep(): Promise<void> {
  onSelectDone();
}

async function usageCreated(usages: RoutingUsage) {
  routingUsagesMapStore.addUses([usages]);
  $q.notify({
    type: 'success',
    message: i18n.t('actions.inserts.success'),
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
