<template>
  <div v-if="!initializing">
    <q-form
      ref="formRef"
      @submit="props.onSubmit"
      @validation-success="returnPartUsage"
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
          v-model="formUsage.quantity"
          type="number"
          :label="$t('parts.usages.quantity')"
          :readonly="readonly"
          :input-validator="partUsageValiationService.quantityRules"
        />
        <div class="column">
          <q-input
            v-model="formUsage.remarks"
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
        v-model="formUsage.customValues"
        :sprmObjectType="sprmObjectType"
      ></CustomAttributesInputPanel>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { QForm } from 'quasar';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import ValidationInput from 'src/components/ValidationInput.vue';
import CustomAttributesInputPanel from 'src/components/CustomAttributesInputPanel.vue';
import { partUsageValiationService } from '../services/PartUsageValidateService';
import { PartUsageChild } from '../models/PartUsageUses';

const formRef = ref<QForm>({} as QForm);

const initializing = ref(false);

const infoExpanded = ref(true);

const sprmObjectType = SprmObjectType.PartUsage;

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  readonly?: boolean,
  onSubmit?:(() => void),
  modelValue: PartUsageChild,
}>(), {
  readonly: true,
});

type Emit = {
  (e: 'update:modelValue', value: PartUsageChild): void
}
const emit = defineEmits<Emit>();

const inputUsage = computed({
  get: (): PartUsageChild => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const formUsage = ref<PartUsageChild>({} as PartUsageChild);

function initialize(): void {
  formUsage.value = JSON.parse(JSON.stringify(inputUsage.value));
}

/**
 * Submit form
 */
function submit(): void {
  formRef.value.submit();
}

function returnPartUsage() {
  emit('update:modelValue', formUsage.value);
}

watch(() => inputUsage.value.id, () => {
  initialize();
});

onBeforeMount(async () => {
  initializing.value = true;
  initialize();
  initializing.value = false;
});

defineExpose({
  submit,
});
</script>
