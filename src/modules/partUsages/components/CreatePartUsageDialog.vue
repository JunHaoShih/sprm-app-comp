<template>
  <div>
    <q-dialog
      v-model="prompt"
      persistent
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card style="min-width: 700px">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ $t('parts.usages.new') }}</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
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
                v-model="pattern"
                :readonly="true"
                v-model:selected="selected"
                selection="single"
                class="main-panel"
                table-class="table-max"
              >
              </PartsSearchPanel>
            </q-step>
            <q-step
              :name="2"
              :title="$t('parts.usages.new')"
              icon="data_usage"
              :header-nav="isUsagePageDone"
            >
              <q-scroll-area class="dialog-inner-max" visible>
                <CreatePartUsagePanel
                  ref="createPartUsagePanel"
                  :parent-part-version-id="selectedPartVersionId"
                  :part-child="selectedSinglePart"
                  :readonly="false"
                  class="main-panel"
                ></CreatePartUsagePanel>
              </q-scroll-area>
            </q-step>
          </q-stepper>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="text-primary">
          <div v-if="isSearchPage">
            <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
            <q-btn flat :label="$t('actions.next')" @click="onNextStep()"></q-btn>
          </div>
          <div v-if="isUsagePage">
            <q-btn flat :label="$t('actions.previous')" @click="stepper.previous()"></q-btn>
            <q-btn flat :label="$t('actions.add')" @click="onAddClicked"></q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { QStepper, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import PartsSearchPanel from 'src/modules/parts/components/PartsSearchPanel.vue';
import { Part } from 'src/modules/parts/models/Part';
import CreatePartUsagePanel, { ICreatePartUsagePanel } from './CreatePartUsagePanel.vue';
import { usePartUsageChildrenStore } from '../stores/PartUsageUsesStore';

const $q = useQuasar();

const i18n = useI18n();

const partUsaeChildrenStore = usePartUsageChildrenStore();

const step = ref(1);

const pattern = ref('');

const selected = ref<Part[]>([]);

const createPartUsagePanel = ref<ICreatePartUsagePanel>({} as ICreatePartUsagePanel);

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

const targetPart = ref<Part>();

const stepper = ref<QStepper>({} as QStepper);

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  modelValue: boolean,
  selectedPartVersionId: number,
}>(), {
  modelValue: false,
  selectedPartVersionId: 0,
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

async function onNextStep(): Promise<void> {
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
  targetPart.value = selectedPart;
  stepper.value.next();
}

async function onAddClicked() {
  const errors = createPartUsagePanel.value.validate();
  if (errors.length > 0) {
    return;
  }
  const usages = await createPartUsagePanel.value.createPartUsage();
  if (!usages) {
    return;
  }
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

:deep(.table-max)
  height: calc(90vh - 300px)

.my-custom-paddding
  .q-stepper
    &__tab
      min-width: none
</style>
