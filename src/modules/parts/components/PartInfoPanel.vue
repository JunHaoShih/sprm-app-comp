<template>
  <div>
    <q-card style="min-width: 400px">
      <q-card-section>
        <slot name="before"></slot>
        <q-scroll-area :class="props.panelClass" visible>
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
              <ValidationInput
                v-model="partVersion.master.number"
                :label="$t('parts.number')"
                :inputValidator="partValidationService.checkNumberRules"
                :readonly="true"
              />
              <ValidationInput
                v-model="partVersion.master.name"
                :label="$t('parts.name')"
                :inputValidator="partValidationService.checkNameRules"
                :readonly="true"
              />
              <div>
                <div class="q-mx-sm text-caption">{{ $t('parts.view') }}</div>
                <q-select
                  filled
                  dense
                  v-model="viewTypeOption"
                  :options="viewTypeOptionsStore.i18nOptions"
                  :readonly="true"
                />
              </div>
              <div class="column">
                <div class="q-mx-sm text-caption">{{ $t('remarks') }}</div>
                <q-input
                  v-model="partVersion.remarks"
                  filled
                  type="textarea"
                  :readonly="readonly"
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
                    v-model="partVersion.customValues[attribute.number]"
                    :readonly="readonly"
                  />
                </div>
              </div>
            </q-expansion-item>
          </div>
        </q-scroll-area>
        <slot name="after"></slot>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { CustomAttribute, CustomOption, DisplayType } from 'src/modules/customs/models/CustomAttribute';
import ValidationInput from 'src/components/ValidationInput.vue';
import { SelectOption } from 'src/models/SelectOption';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { partValidationService } from '../services/PartValidateService';
import { useViewTypeOptionsStore } from '../stores/ViewTypeOptionsStore';
import { ViewTypeOption } from '../models/Part';
import { PartVersion } from '../models/PartVersion';

const i18n = useI18n();

const attrLinksStore = useAttributeLinksStore();

const viewTypeOptionsStore = useViewTypeOptionsStore();

const viewTypeOption = ref<ViewTypeOption>({} as ViewTypeOption);

const infoExpanded = ref(true);

const customValuesExpanded = ref(true);

const middleCustomOptions = ref<Record<number, string>>({} as Record<number, string>);

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  readonly: boolean,
  modelValue: PartVersion,
  panelClass: string,
}>(), {
  readonly: true,
  panelClass: 'default-height',
});

type Emit = {
  (e: 'update:modelValue', value: PartVersion): void
}
const emit = defineEmits<Emit>();

const partVersion = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const targetAttributes = computed(
  (): CustomAttribute[] => attrLinksStore.attributes(ObjectTypeId.PartVersion),
);

function viewTypeInit(): void {
  const targetViewType = viewTypeOptionsStore.i18nOptions.find(
    (viewType) => viewType.value === partVersion.value.master.viewType,
  );
  if (targetViewType) {
    viewTypeOption.value = targetViewType;
  } else {
    const option = viewTypeOptionsStore.i18nOptions[0];
    viewTypeOption.value = option;
  }
}

function getSelectOption(customOptions: CustomOption[], attributeNumber: string) {
  return customOptions.map((option): SelectOption<string> => ({
    label: option.languages[i18n.locale.value],
    value: option.key,
    attributeNumber,
  }));
}

function onSelectOptionUpdated(selectOption: SelectOption<string>) {
  partVersion.value.customValues[selectOption.attributeNumber] = selectOption.value;
}

function updateSingleSelectAttribute() {
  targetAttributes.value.forEach((attr) => {
    if (attr.displayType === DisplayType.SingleSelect) {
      // Get single select value
      const targetValue = partVersion.value.customValues[attr.number];
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

watch(() => partVersion.value.id, () => {
  updateSingleSelectAttribute();
});

watch(() => i18n.locale.value, () => {
  viewTypeInit();
  updateSingleSelectAttribute();
});

onBeforeMount(async () => {
  await attrLinksStore.initialize(ObjectTypeId.PartVersion);
  viewTypeInit();
  updateSingleSelectAttribute();
});
</script>

<style lang="sass" scoped>
.default-height
  height: 400px
</style>
