<template>
  <div>
    <!-- info area -->
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
        <!-- number -->
        <div class="q-ma-sm">{{ $t('customs.generic.number') }}</div>
        <ValidationInput
          v-model="inputAttr.number"
          :readonly="props.readonly"
          :inputValidator="customAttributeValidationService.checkAttributeNumberRules"
        />
        <!-- name -->
        <div class="q-ma-sm">{{ $t('customs.generic.name') }}</div>
        <ValidationInput
          v-model="inputAttr.name"
          :readonly="props.readonly"
          :inputValidator="customAttributeValidationService.checkAttributeNameRules"
        />
        <!-- disable -->
        <div class="row">
          <q-checkbox
            left-label
            class="q-ma-sm"
            v-model="inputAttr.isDisabled"
            :disable="props.readonly"
            :label="$t('customs.generic.disable')"
          />
        </div>
        <!-- attribute type -->
        <div class="q-ma-sm">{{ $t('customs.attributes.attribteType') }}</div>
        <q-select
          filled
          dense
          v-model="attrTypeOption"
          :options="attrTypesStore.i18nOptions"
          :readonly="props.readonly"
          @update:modelValue="onAttrTypeUpdated" />
        <!-- display type -->
        <div class="q-ma-sm">{{ $t('customs.attributes.displayType') }}</div>
        <q-select
          filled
          dense
          v-model="displayTypeOption"
          :options="displayTypesStore.i18nOptions"
          :readonly="props.readonly"
          @update:modelValue="onDisplayTypeUpdated" />
        <CustomOptionsPanel
          v-if="inputAttr.displayType === 1"
          v-model="inputAttr.options"
          :readonly="props.readonly"
        />
        <!-- remarks -->
        <div class="q-ma-sm">{{ $t('remarks') }}</div>
        <q-input
          v-model="inputAttr.remarks"
          :readonly="props.readonly"
          filled
          type="textarea"
        />
      </div>
    </q-expansion-item>

    <q-separator class="q-mb-md"/>

    <!-- language area -->
    <q-expansion-item
      v-model="langExpanded"
      icon="language"
      :label="$t('language')"
      header-class="text-h6 bg-primary text-white"
      expand-icon-class="text-white"
      class="expandable shadow-1 overflow-hidden"
      style="border-radius: 10px"
    >
      <div class="q-pa-sm">
        <div
          v-for="locale in availableLocales"
          :key="locale"
        >
          <div class="q-ma-sm">{{ locale }}</div>
          <ValidationInput v-model="inputAttr.languages[locale]"
            :readonly="props.readonly"
            :inputValidator="languageValidateService.checkLanguageRules"
          />
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { availableLocales } from 'src/models/Locale';
import ValidationInput from 'src/components/ValidationInput.vue';
import CustomOptionsPanel from './CustomOptionsPanel.vue';
import { AttributeTypeOption, CustomAttribute, DisplayTypeOption } from '../models/CustomAttribute';
import { useAttributeTypesStore } from '../stores/AttributeTypesStore';
import { useDisplayTypesStore } from '../stores/DisplayTypesStore';
import { customAttributeValidationService } from '../services/CustomAttributeValidationService';
import { languageValidateService } from '../services/LanguageValidateService';

const attrTypesStore = useAttributeTypesStore();

const displayTypesStore = useDisplayTypesStore();

const props = withDefaults(defineProps<{
  readonly: boolean,
  modelValue: CustomAttribute,
}>(), {
  readonly: true,
});

// eslint-disable-next-line no-spaced-func, func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: CustomAttribute): void
}>();

const inputAttr = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const attrTypeOption = ref<AttributeTypeOption>({} as AttributeTypeOption);

const displayTypeOption = ref<DisplayTypeOption>({} as DisplayTypeOption);

const infoExpanded = ref(true);

const langExpanded = ref(false);

function onAttrTypeUpdated(attrOption: AttributeTypeOption) {
  inputAttr.value.attributeType = attrOption.value;
}

function onDisplayTypeUpdated(diaplayOption: DisplayTypeOption) {
  inputAttr.value.displayType = diaplayOption.value;
}

function initialize(): void {
  const attrType = attrTypesStore.getOption(inputAttr.value.attributeType);
  attrTypeOption.value = attrType;
  const displayType = displayTypesStore.getOption(inputAttr.value.displayType);
  displayTypeOption.value = displayType;
}

watch(() => inputAttr.value.id, (newValue, oldValue) => {
  initialize();
});

onBeforeMount(() => {
  initialize();
});
</script>

<style lang="sass" scoped>
.expandable
  font-family: 'Noto Sans TC'
</style>
