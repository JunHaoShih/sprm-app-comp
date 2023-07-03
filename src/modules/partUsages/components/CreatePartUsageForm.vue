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
          v-model="usageChildDTO.quantity"
          type="number"
          :label="$t('parts.usages.quantity')"
          :readonly="readonly"
          :input-validator="partUsageValiationService.quantityRules"
        />
        <div class="column">
          <q-input
            v-model="usageChildDTO.remarks"
            :label="$t('remarks')"
            filled
            type="textarea"
            :readonly="readonly"
          />
        </div>
      </div>
      </q-expansion-item>

      <q-separator class="q-mb-md"/>
      <CustomAttributesInputPanel
        v-model="usageChildDTO.customValues"
        :sprmObjectType="sprmObjectType"
      ></CustomAttributesInputPanel>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { QForm } from 'quasar';
import { Part } from 'src/modules/parts/models/Part';
import ValidationInput from 'src/components/ValidationInput.vue';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import CustomAttributesInputPanel from 'src/components/CustomAttributesInputPanel.vue';
import { CreatePartUsageChildDTO, CreatePartUsagesDTO } from '../dtos/CreatePartUsagesDTO';
import { partUsageService } from '../services/PartUsageService';
import { PartUsageChild } from '../models/PartUsageUses';
import { partUsageValiationService } from '../services/PartUsageValidateService';

const formRef = ref<QForm>({} as QForm);

const infoExpanded = ref(true);

const initializing = ref(false);

const sprmObjectType = SprmObjectType.PartUsage;

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  readonly: boolean,
  parentPartVersionId: number,
  partChild: Part,
  onSuccess?:((usages: PartUsageChild[]) => void),
  onError?:(() => void),
}>(), {
  readonly: true,
  parentPartVersionId: 0,
});

const usageChildDTO = ref<CreatePartUsageChildDTO>({
  partId: 0,
  quantity: 1,
  remarks: '',
  customValues: {},
});

async function createPartUsage(): Promise<void> {
  const createDto: CreatePartUsagesDTO = {
    partVersionId: props.parentPartVersionId,
    children: [usageChildDTO.value],
  };
  const usages = await partUsageService.insert(createDto);
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

watch(() => props.partChild, () => {
  usageChildDTO.value.partId = props.partChild.id;
});

onBeforeMount(async () => {
  initializing.value = true;
  usageChildDTO.value.partId = props.partChild.id;
  initializing.value = false;
});

defineExpose({
  submit,
});
</script>
