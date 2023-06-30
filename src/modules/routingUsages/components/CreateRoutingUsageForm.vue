<template>
  <div v-if="!initializing">
    <q-form
      ref="formRef"
      @submit="createPartUsage"
    >
      <q-expansion-item
        v-model="infoExpanded"
        icon="article"
        :label="$t('info')"
        header-class="text-h6 bg-secondary text-white"
        expand-icon-class="text-white"
        class="expandable shadow-1 overflow-hidden"
        style="border-radius: 10px"
      >
        <div class="q-pa-sm">
          <ValidationInput
            v-model="createDto.number"
            type="text"
            :label="$t('parts.routings.processes.number')"
            :readonly="readonly"
            :input-validator="routingUsageValidationService.numberRules"
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
import { onBeforeMount, ref } from 'vue';
import { QForm } from 'quasar';
import ValidationInput from 'src/components/ValidationInput.vue';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import CustomAttributesInputPanel from 'src/components/CustomAttributesInputPanel.vue';
import { Process } from 'src/modules/processes/models/Process';
import { RoutingUsage } from '../models/RoutingUsage';
import { CreateRoutingUsageDTO } from '../dtos/CreateRoutingUsageDTO';
import { routingUsageService } from '../services/RoutingUsageService';
import { routingUsageValidationService } from '../services/RoutingUsageValidateService';

const formRef = ref<QForm>({} as QForm);

const infoExpanded = ref(true);

const initializing = ref(false);

const sprmObjectType = SprmObjectType.RoutingUsage;

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  readonly: boolean,
  rootRoutingVersionId: number,
  parentUsageId: number | null,
  process: Process,
  defaultNumber: string,
  onSuccess?:((usages: RoutingUsage) => void),
  onError?:(() => void),
}>(), {
  readonly: true,
  parentPartVersionId: 0,
});

const createDto = ref<CreateRoutingUsageDTO>({
  remarks: '',
  rootVersionId: 0,
  parentUsageId: 0,
  number: '',
  processId: 0,
  customValues: {},
});

async function createPartUsage(): Promise<void> {
  const usages = await routingUsageService.insert(createDto.value);
  if (usages && props.onSuccess) {
    props.onSuccess(usages);
  } else if (!usages && props.onError) {
    props.onError();
  }
}

/**
 * Submit form
 */
function submit(): void {
  formRef.value.submit();
}

onBeforeMount(async () => {
  initializing.value = true;
  createDto.value.rootVersionId = props.rootRoutingVersionId;
  createDto.value.parentUsageId = props.parentUsageId;
  createDto.value.processId = props.process.id;
  createDto.value.number = props.defaultNumber;
  initializing.value = false;
});

defineExpose({
  submit,
});
</script>
