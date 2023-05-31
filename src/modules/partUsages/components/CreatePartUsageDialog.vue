<template>
  <div>
    <q-dialog
      v-model="prompt"
      persistent
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card style="min-width: 700px">
        <q-form
          @submit="onNextStep"
        >
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
                  v-if="createType === 'search'"
                  v-model="pattern"
                  :readonly="true"
                  v-model:selected="selected"
                  selection="single"
                  class="main-panel"
                  table-class="table-max"
                />
                <q-scroll-area
                  v-if="createType === 'create'"
                  class="dialog-inner-max" visible
                >
                  <CreatePartPanel
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
                  <CreatePartUsagePanel
                    ref="createPartUsagePanel"
                    :on-success="usageCreated"
                    :parent-part-version-id="selectedPartVersionId"
                    :part-child="selectedSinglePart"
                    :readonly="false"
                    class="main-panel"
                  />
                </q-scroll-area>
              </q-step>
            </q-stepper>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right" class="text-primary">
            <div v-if="isSearchPage">
              <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
              <q-btn flat :label="$t('actions.next')" type="submit"></q-btn>
            </div>
            <div v-if="isUsagePage">
              <q-btn flat :label="$t('actions.previous')" @click="stepper.previous()"></q-btn>
              <q-btn flat :label="$t('actions.add')" @click="submit"></q-btn>
            </div>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { QStepper, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import CreatePartPanel from 'src/modules/parts/components/CreatePartPanel.vue';
import PartsSearchPanel from 'src/modules/parts/components/PartsSearchPanel.vue';
import { Part } from 'src/modules/parts/models/Part';
import CreatePartUsagePanel from './CreatePartUsagePanel.vue';
import { usePartUsageChildrenStore } from '../stores/PartUsageUsesStore';
import { PartUsageChild } from '../models/PartUsageUses';

export type CreateType = 'create' | 'search' | 'none';

const $q = useQuasar();

const i18n = useI18n();

const partUsaeChildrenStore = usePartUsageChildrenStore();

const step = ref(1);

const pattern = ref('');

const selected = ref<Part[]>([]);

const formRef = ref<InstanceType<typeof CreatePartPanel>>();

const createPartUsagePanel = ref<InstanceType<typeof CreatePartUsagePanel>>();

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
  createPartUsagePanel.value?.submit();
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

:deep(.table-max)
  height: calc(90vh - 300px)

.my-custom-paddding
  .q-stepper
    &__tab
      min-width: none
</style>
