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
          >
            <q-step
              :name="1"
              :title="$t('parts.new')"
              icon="settings"
              :done="isCreatePageDone"
            >
              <q-scroll-area class="dialog-inner-max" visible>
                <CreatePartPanel
                  ref="createPartPanelRef"
                />
              </q-scroll-area>
            </q-step>
            <q-step
              :name="2"
              :title="$t('parts.usages.new')"
              icon="data_usage"
            >
              <q-scroll-area class="dialog-inner-max" visible>
                <CreatePartUsagePanel
                  :parent-part-version-id="selectedPartVersionId"
                  :part-child="targetPart"
                  :readonly="false"
                />
              </q-scroll-area>
            </q-step>
          </q-stepper>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="text-primary">
          <div v-if="isCreatePage">
            <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
            <q-btn flat :label="$t('actions.next')" @click="onCreatePart()"></q-btn>
          </div>
          <div v-if="isUsagePage">
            <q-btn flat :label="$t('actions.previous')" @click="stepper.previous()"></q-btn>
            <q-btn flat :label="$t('actions.next')" @click="stepper.next()"></q-btn>
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
import CreatePartPanel, { ICreatePartPanel } from 'src/modules/parts/components/CreatePartPanel.vue';
import { Part } from 'src/modules/parts/models/Part';
import CreatePartUsagePanel from './CreatePartUsagePanel.vue';

const $q = useQuasar();

const i18n = useI18n();

const step = ref(1);

const isCreatePage = computed(
  (): boolean => step.value === 1,
);

const isCreatePageDone = computed(
  (): boolean => step.value > 1,
);

const isUsagePage = computed(
  (): boolean => step.value === 2,
);

const targetPart = ref<Part>({} as Part);

const createPartPanelRef = ref<ICreatePartPanel>({} as ICreatePartPanel);

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

async function onCreatePart(): Promise<void> {
  const messages = createPartPanelRef.value.validate();
  if (messages.length > 0) {
    const message = messages[0];
    $q.notify({
      message: i18n.t(message),
      color: 'red',
      icon: 'error',
    });
    return;
  }
  const newPart = await createPartPanelRef.value.createPart();
  if (!newPart) {
    return;
  }
  targetPart.value = newPart;
  stepper.value.next();
}
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 250px)
</style>
