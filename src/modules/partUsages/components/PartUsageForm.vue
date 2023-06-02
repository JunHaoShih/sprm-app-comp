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
        header-class="text-h6 bg-primary text-white"
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
      </div>
      </q-expansion-item>

      <q-separator class="q-mb-md"/>

      <q-expansion-item
        v-model="customValuesExpanded"
        icon="language"
        :label="$t('customs.attributes.title')"
        header-class="text-h6 bg-primary text-white"
        expand-icon-class="text-white"
        class="expandable shadow-1 overflow-hidden"
        style="border-radius: 10px"
      >
        <div class="q-pa-sm">
          <div
            v-for="attribute in targetAttributes"
            :key="attribute.id"
          >
            <div
              v-if="attribute.displayType === DisplayType.SingleSelect"
            >
              <div class="q-mx-sm text-caption">
                {{ attribute.languages[i18n.locale.value] }}
              </div>
              <q-select
                v-if="attribute.displayType === DisplayType.SingleSelect"
                filled
                dense
                :readonly="readonly"
                v-model="middleCustomOptions[attribute.id]"
                :options="getSelectOption(attribute.options, attribute.number)"
                @update:modelValue="onSelectOptionUpdated"
              />
            </div>
            <ValidationInput
              v-else
              :label="attribute.languages[i18n.locale.value]"
              v-model="formUsage.customValues[attribute.number]"
              :readonly="readonly"
            />
          </div>
        </div>
      </q-expansion-item>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { QForm } from 'quasar';
import { useI18n } from 'vue-i18n';
import { CustomAttribute, CustomOption, DisplayType } from 'src/modules/customs/models/CustomAttribute';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { SelectOption } from 'src/models/SelectOption';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import ValidationInput from 'src/components/ValidationInput.vue';
import { partUsageValiationService } from '../services/PartUsageValidateService';
import { PartUsageChild } from '../models/PartUsageUses';

const i18n = useI18n();

const attrLinksStore = useAttributeLinksStore();

const formRef = ref<QForm>({} as QForm);

const initializing = ref(false);

const infoExpanded = ref(true);

const customValuesExpanded = ref(true);

const middleCustomOptions = ref<Record<number, string>>({} as Record<number, string>);

const targetAttributes = computed(
  (): CustomAttribute[] => attrLinksStore.attributes(ObjectTypeId.PartUsage),
);

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

function getSelectOption(customOptions: CustomOption[], attributeNumber: string) {
  return customOptions.map((option): SelectOption<string> => ({
    label: option.languages[i18n.locale.value],
    value: option.key,
    attributeNumber,
  }));
}

function onSelectOptionUpdated(selectOption: SelectOption<string>) {
  formUsage.value.customValues[selectOption.attributeNumber] = selectOption.value;
}

function updateSingleSelectAttribute() {
  targetAttributes.value.forEach((attr) => {
    if (attr.displayType === DisplayType.SingleSelect) {
      // Get single select value
      const targetValue = formUsage.value.customValues[attr.number];
      // Get option by single select value
      const targetOption = attr.options.find(
        (option) => option.key === targetValue,
      );
      if (targetOption) {
        // Display language or default display if option exist
        middleCustomOptions.value[attr.id] = targetOption.languages[i18n.locale.value]
          || targetOption.value;
      } else {
        // Display raw value if option not exist
        middleCustomOptions.value[attr.id] = targetValue;
      }
    }
  });
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
  if (attrLinksStore.attributes(ObjectTypeId.PartUsage).length === 0) {
    await attrLinksStore.initialize(ObjectTypeId.PartUsage);
  }
  updateSingleSelectAttribute();
  initializing.value = false;
});

defineExpose({
  submit,
});
</script>
