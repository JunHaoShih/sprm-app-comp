<template>
  <div v-if="!initializing">
    <q-form
      ref="formRef"
      @submit="createProcess"
    >
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
          v-model="createDto.number"
          :label="$t('processes.number')"
          :inputValidator="processValidationService.numberRules"
        />
        <ValidationInput
          v-model="createDto.name"
          :label="$t('processes.name')"
          :inputValidator="processValidationService.nameRules"
        />
        <div class="q-mx-sm text-caption">{{ $t('processes.processType') }}</div>
        <q-select
          filled
          dense
          v-model="processTypeOption"
          :options="processTypeOptions"
          @update:modelValue="onSelectedProcessTypeOptionUpdated"
        />
        <div class="q-mx-sm text-caption">{{ $t('processes.makeType') }}</div>
        <q-select
          filled
          dense
          v-model="makeTypeOption"
          :options="makeTypeOptions"
          @update:modelValue="onSelectedMakesTypeOptionUpdated"
        />
        <ValidationInput
          v-model="createDto.defaultImportTime"
          :label="$t('processes.defaultImportTime')"
          type="number"
          :inputValidator="processValidationService.timeRules"
        />
        <ValidationInput
          v-model="createDto.defaultExportTime"
          :label="$t('processes.defaultExportTime')"
          type="number"
          :inputValidator="processValidationService.timeRules"
        />
        <div class="column">
          <div class="q-mx-sm text-caption">{{ $t('remarks') }}</div>
          <q-input
            v-model="createDto.remarks"
            label="remarks" filled
            type="textarea"
          />
        </div>
      </div>
      </q-expansion-item>

      <q-separator class="q-mb-md"/>
      <CustomAttributesInputPanel
        v-model="createDto.customValues"
        :sprmObjectType="sprmObjectType"
      ></CustomAttributesInputPanel>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { QForm } from 'quasar';
import { useI18n } from 'vue-i18n';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { ProcessType } from 'src/modules/processTypes/models/ProcessType';
import { MakeType } from 'src/modules/makeTypes/models/MakeType';
import ValidationInput from 'src/components/ValidationInput.vue';
import CustomAttributesInputPanel from 'src/components/CustomAttributesInputPanel.vue';
import { processTypeService } from 'src/modules/processTypes/services/ProcessTypeService';
import { SelectOption } from 'src/models/SelectOption';
import { makeTypeService } from 'src/modules/makeTypes/services/MakeTypeService';
import { CreateProcessDTO } from '../dtos/CreateProcessDTO';
import { Process } from '../models/Process';
import { processService } from '../services/ProcessService';
import { processValidationService } from '../services/ProcessValidateService';

const i18n = useI18n();

const formRef = ref<QForm>({} as QForm);

const infoExpanded = ref(true);

const initializing = ref(false);

const sprmObjectType = SprmObjectType.PartVersion;

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

const createDto = ref<CreateProcessDTO>({
  number: '',
  name: '',
  remarks: '',
  processTypeId: 1,
  defaultMakeTypeId: 0,
  defaultImportTime: 0,
  defaultExportTime: 0,
  customValues: {},
});

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  onSuccess?:((part: Process) => void),
  onError?:(() => void),
}>(), {
});

function onSelectedProcessTypeOptionUpdated(option: SelectOption<number>) {
  createDto.value.processTypeId = option.value;
}

function onSelectedMakesTypeOptionUpdated(option: SelectOption<number>) {
  createDto.value.defaultMakeTypeId = option.value;
}

async function createProcess(): Promise<void> {
  console.log(createDto.value);
  const newProcess = await processService.create(createDto.value);
  if (newProcess && props.onSuccess) {
    props.onSuccess(newProcess);
  } else if (!newProcess && props.onError) {
    props.onError();
  }
}

function resetDto() {
  createDto.value = {
    number: '',
    name: '',
    remarks: '',
    processTypeId: 1,
    defaultMakeTypeId: 1,
    defaultImportTime: 0,
    defaultExportTime: 0,
    customValues: {},
  };
}

/**
 * Submit form
 */
function submit(): void {
  formRef.value.submit();
}

async function initializeProcessTypes() {
  const fetchedProcessTypes = await processTypeService.getAll();
  if (fetchedProcessTypes) {
    processTypes.value = fetchedProcessTypes;
    const firstOption = processTypeOptions.value[0];
    processTypeOption.value = firstOption;
    createDto.value.processTypeId = firstOption.value;
  }
}

async function initializeMakeTypes() {
  const fetchedMakeTypes = await makeTypeService.getAll();
  if (fetchedMakeTypes) {
    makeTypes.value = fetchedMakeTypes;
    const firstOption = makeTypeOptions.value[0];
    makeTypeOption.value = firstOption;
    createDto.value.defaultMakeTypeId = firstOption.value;
  }
}

onBeforeMount(async () => {
  initializing.value = true;
  resetDto();
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
