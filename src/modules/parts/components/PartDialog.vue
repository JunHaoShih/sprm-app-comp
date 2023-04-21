<template>
  <q-dialog ref="dialogRef" v-model="prompt" persistent
    transition-show="rotate" transition-hide="rotate"
  >
    <q-card style="min-width: 700px">
      <q-card-section class="bg-primary text-white row items-center">
        <div class="text-h6">{{ $t('parts.new') }}</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
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
                v-for="attribute in attrLinksStore.content.attributes"
                :key="attribute.id"
              >
                <div class="q-ma-sm">
                  {{ attribute.languages[i18n.locale.toString()] }}
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
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
        <q-btn flat :label="$t('actions.confirm')" @click="onDialogConfirm"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { QDialog, useQuasar } from 'quasar';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { CustomOption, DisplayType } from 'src/modules/customs/models/CustomAttribute';
import { SelectOption } from 'src/models/SelectOption';
import ValidationInput from 'src/components/ValidationInput.vue';
import { partValidationService } from '../services/PartValidateService';
import { useCreatePartStore } from '../stores/CreatePartStore';
import { useViewTypeOptionsStore } from '../stores/ViewTypeOptionsStore';
import { Part, ViewTypeOption } from '../models/Part';

const i18n = useI18n();

const $q = useQuasar();

const createPartStore = useCreatePartStore();

const attrLinksStore = useAttributeLinksStore();

const viewTypeOptionsStore = useViewTypeOptionsStore();

const viewTypeOption = ref<ViewTypeOption>({} as ViewTypeOption);

const createdPart = ref<Part>({} as Part);

const infoExpanded = ref(true);

const customValuesExpanded = ref(true);

const middleCustomOptions = ref<Record<number, string>>({} as Record<number, string>);

const dialogRef = ref<QDialog>({} as QDialog);

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  modelValue: boolean,
}>(), {
  modelValue: false,
});

type Emit = {
  (e: 'update:modelValue', value: boolean): void
  (e: 'onPartCreated', value: Part): void
}
const emit = defineEmits<Emit>();

const prompt = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function onViewTypeUpdated(value: ViewTypeOption) {
  createPartStore.viewType = value.value;
}

async function onDialogConfirm(): Promise<void> {
  if (!createPartStore.isPartValid()) {
    return;
  }
  const newPart = await createPartStore.create();
  if (!newPart) {
    return;
  }
  createdPart.value = newPart;
  emit('onPartCreated', createdPart.value);
  $q.notify({
    message: `${createdPart.value.number} ${i18n.t('actions.inserts.success')}`,
    color: 'secondary',
  });
  dialogRef.value.hide();
}

function getSelectOption(customOptions: CustomOption[], attributeNumber: string) {
  return customOptions.map((option): SelectOption<string> => ({
    label: option.languages[i18n.locale.toString()],
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
  createPartStore.customValues = Object.fromEntries(attrLinksStore.content.attributes.map((attr) => [attr.number, '']));
  for (let i = 0; i < attrLinksStore.content.attributes.length; i += 1) {
    const attr = attrLinksStore.content.attributes[i];
    if (attr.displayType === DisplayType.SingleSelect) {
      const firstOption = attr.options[0];
      middleCustomOptions.value[attr.id] = firstOption.key;
    }
  }
});
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
