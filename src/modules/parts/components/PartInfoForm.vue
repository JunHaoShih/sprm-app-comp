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
                  v-model="partVersion.master.number"
                  :label="$t('parts.number')"
                  :inputValidator="partValidationService.numberRules"
                  :readonly="true"
                />
                <ValidationInput
                  v-model="partVersion.master.name"
                  :label="$t('parts.name')"
                  :inputValidator="partValidationService.nameRules"
                  :readonly="true"
                />
                <div>
                  <q-select
                    filled
                    dense
                    v-model="viewTypeOption"
                    :label="$t('parts.view')"
                    :options="viewTypeOptionsStore.i18nOptions"
                    :readonly="true"
                    class="q-my-md"
                  />
                </div>
                <div class="column">
                  <q-input
                    v-model="partVersion.remarks"
                    :label="$t('remarks')"
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
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { QForm } from 'quasar';
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

const formRef = ref<QForm>({} as QForm);

const viewTypeOption = ref<ViewTypeOption>({} as ViewTypeOption);

const infoExpanded = ref(true);

const customValuesExpanded = ref(true);

const middleCustomOptions = ref<Record<number, string>>({} as Record<number, string>);

const initializing = ref(true);

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  readonly: boolean,
  modelValue: PartVersion,
  onSubmit?:(() => void),
  panelClass?: string,
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

/**
 * Validate form
 */
async function validate(): Promise<boolean> {
  const result = await formRef.value.validate();
  return result;
}

/**
 * Submit form
 */
function submit(): void {
  formRef.value.submit();
}

watch(() => partVersion.value.id, () => {
  updateSingleSelectAttribute();
});

watch(() => i18n.locale.value, () => {
  viewTypeInit();
  updateSingleSelectAttribute();
});

onBeforeMount(async () => {
  initializing.value = true;
  await attrLinksStore.initialize(ObjectTypeId.PartVersion);
  partVersion.value.customValues = Object.fromEntries(targetAttributes.value.map((attr) => [attr.number, '']));
  viewTypeInit();
  updateSingleSelectAttribute();
  initializing.value = false;
});

defineExpose({
  validate,
  submit,
});
</script>

<style lang="sass" scoped>
.default-height
  height: 400px
</style>
