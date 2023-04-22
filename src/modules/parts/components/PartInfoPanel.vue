<template>
  <div>
    <q-card style="min-width: 700px">
      <q-card-section class="scroll dialog-inner-max">
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
            <ValidationInput v-model="partVersion.master.number"
              :inputValidator="partValidationService.checkNumberRules"
              :readonly="true"
            />
            <div class="q-ma-sm">{{ $t('parts.name') }}</div>
            <ValidationInput v-model="partVersion.master.name"
              :inputValidator="partValidationService.checkNameRules"
              :readonly="true"
            />
            <div>
              <div class="q-ma-sm">{{ $t('parts.view') }}</div>
              <q-select
                filled
                dense
                v-model="viewTypeOption"
                :options="viewTypeOptionsStore.i18nOptions"
                :readonly="true"
              />
            </div>
            <div class="column">
              <div class="q-ma-sm">{{ $t('remarks') }}</div>
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
                v-for="attribute in attrLinksStore.content.attributes"
                :key="attribute.id"
              >
                <div class="q-ma-sm">
                  {{ attribute.languages[i18n.locale.value] }}
                </div>
                <q-select
                  v-if="attribute.displayType === DisplayType.SingleSelect"
                  filled
                  dense
                  :readonly="readonly"
                  v-model="middleCustomOptions[attribute.id]"
                  :options="getSelectOption(attribute.options, attribute.number)"
                  @update:modelValue="onSelectOptionUpdated" />
                <ValidationInput
                  v-else
                  v-model="partVersion.customValues[attribute.number]"
                  :readonly="readonly"
                />
              </div>
            </div>
          </q-expansion-item>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { CustomOption, DisplayType } from 'src/modules/customs/models/CustomAttribute';
import ValidationInput from 'src/components/ValidationInput.vue';
import { SelectOption } from 'src/models/SelectOption';
import { partValidationService } from '../services/PartValidateService';
import { useViewTypeOptionsStore } from '../stores/ViewTypeOptionsStore';
import { ViewTypeOption } from '../models/Part';
import { PartVersion } from '../models/PartVersion';

const i18n = useI18n();

const $q = useQuasar();

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
  id: string,
  readonly: boolean,
  modelValue: PartVersion,
}>(), {
  id: '',
  readonly: true,
});

type Emit = {
  (e: 'update:modelValue', value: PartVersion): void
}
const emit = defineEmits<Emit>();

const partVersion = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

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

onBeforeMount(() => {
  $q.loading.show({
    delay: 300,
  });
  viewTypeInit();
  for (let i = 0; i < attrLinksStore.content.attributes.length; i += 1) {
    const attr = attrLinksStore.content.attributes[i];
    if (attr.displayType === DisplayType.SingleSelect) {
      const firstOption = attr.options[0];
      middleCustomOptions.value[attr.id] = firstOption.key;
    }
  }
  $q.loading.hide();
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 70px)
</style>
