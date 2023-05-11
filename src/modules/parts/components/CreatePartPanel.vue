<template>
  <div>
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
      <div class="q-ma-sm">{{ $t('parts.number') }}</div>
      <ValidationInput v-model="createPartStore.number"
        :inputValidator="partValidationService.checkNumberRules"
      />
      <div class="q-ma-sm">{{ $t('parts.name') }}</div>
      <ValidationInput v-model="createPartStore.name"
        :inputValidator="partValidationService.checkNameRules"
      />
      <div>
        <div class="q-ma-sm">{{ $t('parts.view') }}</div>
        <q-select
          filled
          dense
          v-model="viewTypeOption"
          :options="viewTypeOptionsStore.i18nOptions"
          @update:modelValue="onViewTypeUpdated" />
      </div>
      <div class="column">
        <div class="q-ma-sm">{{ $t('remarks') }}</div>
        <q-input
          v-model="createPartStore.remarks"
          label="remarks" filled
          type="textarea"
        />
      </div>
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
          <div class="q-ma-sm">
            {{ attribute.languages[i18n.locale.value] }}
          </div>
          <q-select
            v-if="attribute.displayType === DisplayType.SingleSelect"
            filled
            dense
            v-model="middleCustomOptions[attribute.id]"
            :options="getSelectOption(attribute.options, attribute.number)"
            @update:modelValue="onSelectOptionUpdated" />
          <ValidationInput
            v-else
            v-model="createPartStore.customValues[attribute.number]"
          />
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<script setup lang="ts">
import {
  ComponentPublicInstance, computed, onBeforeMount, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { SelectOption } from 'src/models/SelectOption';
import { CustomAttribute, CustomOption, DisplayType } from 'src/modules/customs/models/CustomAttribute';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import ValidationInput from 'src/components/ValidationInput.vue';
import { partValidationService } from '../services/PartValidateService';
import { useCreatePartStore } from '../stores/CreatePartStore';
import { useViewTypeOptionsStore } from '../stores/ViewTypeOptionsStore';
import { Part, ViewTypeOption } from '../models/Part';

export interface ICreatePartPanel extends ComponentPublicInstance {
  validate: (() => string | undefined),
  createPart: () => Promise<Part | null>,
}

const i18n = useI18n();

const createPartStore = useCreatePartStore();

const attrLinksStore = useAttributeLinksStore();

const viewTypeOptionsStore = useViewTypeOptionsStore();

const viewTypeOption = ref<ViewTypeOption>({} as ViewTypeOption);

const infoExpanded = ref(true);

const customValuesExpanded = ref(true);

const middleCustomOptions = ref<Record<number, string>>({} as Record<number, string>);

const targetAttributes = computed(
  (): CustomAttribute[] => attrLinksStore.attributes(ObjectTypeId.PartVersion),
);

function onViewTypeUpdated(value: ViewTypeOption) {
  createPartStore.viewType = value.value;
}

function validate(): string | undefined {
  return createPartStore.validateCreatePart();
}

async function createPart(): Promise<Part | null> {
  const newPart = await createPartStore.create();
  return newPart;
}

function getSelectOption(customOptions: CustomOption[], attributeNumber: string) {
  return customOptions.map((option): SelectOption<string> => ({
    label: option.languages[i18n.locale.value],
    value: option.key,
    attributeNumber,
  }));
}

function onSelectOptionUpdated(selectOption: SelectOption<string>) {
  createPartStore.customValues[selectOption.attributeNumber] = selectOption.value;
}

onBeforeMount(async () => {
  const option = viewTypeOptionsStore.i18nOptions[0];
  viewTypeOption.value = option;
  createPartStore.customValues = Object.fromEntries(targetAttributes.value.map((attr) => [attr.number, '']));
  for (let i = 0; i < targetAttributes.value.length; i += 1) {
    const attr = targetAttributes.value[i];
    if (attr.displayType === DisplayType.SingleSelect) {
      const firstOption = attr.options[0];
      middleCustomOptions.value[attr.id] = firstOption.key;
    }
  }
});

defineExpose({
  validate,
  createPart,
});
</script>
