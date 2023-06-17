<template>
  <q-expansion-item
    v-if="!initializing"
    v-model="customValuesExpanded"
    icon="language"
    :label="$t('customs.attributes.title')"
    header-class="info-card-header"
    class="info-card-body"
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
            v-model="middleCustomOptions[attribute.id]"
            :options="getSelectOption(attribute.options, attribute.number)"
            @update:modelValue="onSelectOptionUpdated"
            :readonly="props.readonly"
          />
        </div>
        <ValidationInput
          v-else
          :label="attribute.languages[i18n.locale.value]"
          v-model="customValues[attribute.number]"
          :readonly="props.readonly"
        />
      </div>
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { SelectOption } from 'src/models/SelectOption';
import { CustomAttribute, CustomOption, DisplayType } from 'src/modules/customs/models/CustomAttribute';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import ValidationInput from './ValidationInput.vue';

const initializing = ref(false);

const i18n = useI18n();

const attrLinksStore = useAttributeLinksStore();

const customValuesExpanded = ref(true);

const middleCustomOptions = ref<Record<number, string>>({} as Record<number, string>);

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  sprmObjectType: SprmObjectType,
  modelValue: Record<string, string>,
  readonly?: boolean,
}>(), {
  readonly: false,
});

type Emit = {
  (e: 'update:modelValue', value: Record<string, string>): void,
}
const emit = defineEmits<Emit>();

const customValues = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const targetAttributes = computed(
  (): CustomAttribute[] => attrLinksStore.attributes(props.sprmObjectType),
);

function getSelectOption(customOptions: CustomOption[], attributeNumber: string) {
  return customOptions.map((option): SelectOption<string> => ({
    label: option.languages[i18n.locale.value],
    value: option.key,
    attributeNumber,
  }));
}

function onSelectOptionUpdated(selectOption: SelectOption<string>) {
  customValues.value[selectOption.attributeNumber] = selectOption.value;
}

function updateSingleSelectAttribute() {
  targetAttributes.value.forEach((attr) => {
    if (attr.displayType === DisplayType.SingleSelect) {
      // Get single select value
      const targetValue = customValues.value[attr.number];
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

watch(() => i18n.locale.value, () => {
  updateSingleSelectAttribute();
});

onBeforeMount(async () => {
  initializing.value = true;
  await attrLinksStore.initialize(props.sprmObjectType);
  if (Object.keys(customValues.value).length === 0) {
    customValues.value = Object.fromEntries(targetAttributes.value.map((attr) => [attr.number, '']));
  }
  updateSingleSelectAttribute();
  initializing.value = false;
});
</script>
