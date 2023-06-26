<template>
  <div v-if="!initializing">
    <q-card style="min-width: 400px">
      <q-form
        @submit="props.onSubmit"
      >
        <q-card-section>
          <slot name="before"></slot>
          <q-scroll-area :class="props.panelClass" visible>
            <div>
              <q-expansion-item
                v-model="infoExpanded"
                icon="article"
                :label="$t('info')"
                header-class="info-card-header"
                class="info-card-body"
                style="border-radius: 10px"
              >
              <div class="q-pa-sm">
                <ValidationInput
                  v-model="process.number"
                  :label="$t('processes.number')"
                  :inputValidator="processValidationService.numberRules"
                  :readonly="readonly"
                />
                <ValidationInput
                  v-model="process.name"
                  :label="$t('processes.name')"
                  :inputValidator="processValidationService.nameRules"
                  :readonly="readonly"
                />
                <div class="q-mx-sm text-caption">{{ $t('processes.processType') }}</div>
                <q-select
                  filled
                  dense
                  v-model="processTypeOption"
                  :options="processTypeOptions"
                  :readonly="readonly"
                  @update:modelValue="onSelectedProcessTypeOptionUpdated"
                />
                <div class="q-mx-sm text-caption">{{ $t('processes.makeType') }}</div>
                <q-select
                  filled
                  dense
                  v-model="makeTypeOption"
                  :options="makeTypeOptions"
                  :readonly="readonly"
                  @update:modelValue="onSelectedMakesTypeOptionUpdated"
                />
                <ValidationInput
                  v-model="process.defaultImportTime"
                  :label="$t('processes.defaultImportTime')"
                  type="number"
                  :readonly="readonly"
                  :inputValidator="processValidationService.timeRules"
                />
                <ValidationInput
                  v-model="process.defaultExportTime"
                  :label="$t('processes.defaultExportTime')"
                  type="number"
                  :readonly="readonly"
                  :inputValidator="processValidationService.timeRules"
                />
                <div class="column">
                  <div class="q-mx-sm text-caption">{{ $t('remarks') }}</div>
                  <q-input
                    v-model="process.remarks"
                    label="remarks" filled
                    :readonly="readonly"
                    type="textarea"
                  />
                </div>
              </div>
              </q-expansion-item>
              <q-separator class="q-mb-md"/>

              <CustomAttributesInputPanel
                v-model="process.customValues"
                :sprmObjectType="sprmObjectType"
                :readonly="readonly"
              ></CustomAttributesInputPanel>
            </div>
          </q-scroll-area>
          <slot name="after"></slot>
        </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { QForm } from 'quasar';
import ValidationInput from 'src/components/ValidationInput.vue';
import CustomAttributesInputPanel from 'src/components/CustomAttributesInputPanel.vue';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { ProcessType } from 'src/modules/processTypes/models/ProcessType';
import { SelectOption } from 'src/models/SelectOption';
import { MakeType } from 'src/modules/makeTypes/models/MakeType';
import { processTypeService } from 'src/modules/processTypes/services/ProcessTypeService';
import { makeTypeService } from 'src/modules/makeTypes/services/MakeTypeService';
import { Process } from '../models/Process';
import { processValidationService } from '../services/ProcessValidateService';

const i18n = useI18n();

const formRef = ref<QForm>({} as QForm);

const infoExpanded = ref(true);

const initializing = ref(true);

const sprmObjectType = SprmObjectType.Process;

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  readonly: boolean,
  modelValue: Process,
  onSubmit?:(() => void),
  panelClass?: string,
}>(), {
  readonly: true,
  panelClass: 'default-height',
});

type Emit = {
  (e: 'update:modelValue', value: Process): void
}
const emit = defineEmits<Emit>();

const process = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const processTypes = ref<ProcessType[]>([]);

const processTypeOption = ref<SelectOption<number>>({} as SelectOption<number>);

const processTypeOptions = computed(
  () => processTypes.value.map((processType): SelectOption<number> => ({
    label: processType.languages[i18n.locale.value] ?? processType.name,
    value: processType.id,
    attributeNumber: processType.number,
  })),
);

const makeTypes = ref<MakeType[]>([]);

const makeTypeOption = ref<SelectOption<number>>({} as SelectOption<number>);

const makeTypeOptions = computed(
  () => makeTypes.value.map((makeType): SelectOption<number> => ({
    label: makeType.languages[i18n.locale.value] ?? makeType.name,
    value: makeType.id,
    attributeNumber: makeType.number,
  })),
);

/**
 * Submit form
 */
function submit(): void {
  formRef.value.submit();
}

function onSelectedProcessTypeOptionUpdated(option: SelectOption<number>) {
  const targetProcessType = processTypes.value
    .find((processType) => processType.id === option.value);
  if (targetProcessType) {
    process.value.processType = targetProcessType;
  }
}

function onSelectedMakesTypeOptionUpdated(option: SelectOption<number>) {
  const targetMakeType = makeTypes.value
    .find((makeType) => makeType.id === option.value);
  if (targetMakeType) {
    process.value.defaultMakeType = targetMakeType;
  }
}

/**
 * Initialize process types before mount
 */
async function initializeProcessTypes() {
  const fetchedProcessTypes = await processTypeService.getAll();
  if (fetchedProcessTypes) {
    processTypes.value = fetchedProcessTypes;
    const targetTypeOption = processTypeOptions.value.find(
      (option) => option.value === process.value.processType.id,
    );
    if (targetTypeOption) {
      processTypeOption.value = targetTypeOption;
    }
  }
}

/**
 * Initialize make types before mount
 */
async function initializeMakeTypes() {
  const fetchedMakeTypes = await makeTypeService.getAll();
  if (fetchedMakeTypes) {
    makeTypes.value = fetchedMakeTypes;
    const targetTypeOption = makeTypeOptions.value.find(
      (option) => option.value === process.value.defaultMakeType.id,
    );
    if (targetTypeOption) {
      makeTypeOption.value = targetTypeOption;
    }
  }
}

onBeforeMount(async () => {
  initializing.value = true;
  await Promise.all([
    initializeProcessTypes(),
    initializeMakeTypes(),
  ]);
  initializing.value = false;
});

defineExpose({
  submit,
});
</script>

<style lang="sass" scoped>
.default-height
  height: 400px
</style>
