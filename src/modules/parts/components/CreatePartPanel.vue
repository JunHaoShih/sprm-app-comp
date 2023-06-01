<template>
  <div v-if="!initializing">
    <q-form
      ref="formRef"
      @submit="createPart"
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
          v-model="createDto.number"
          :label="$t('parts.number')"
          :inputValidator="partValidationService.numberRules"
        />
        <ValidationInput
          v-model="createDto.name"
          :label="$t('parts.name')"
          :inputValidator="partValidationService.nameRules"
        />
        <div>
          <div class="q-mx-sm text-caption">{{ $t('parts.view') }}</div>
          <q-select
            filled
            dense
            v-model="viewTypeOption"
            :options="viewTypeOptionsStore.i18nOptions"
            @update:modelValue="onViewTypeUpdated" />
        </div>
        <div class="column">
          <div class="q-mx-sm text-caption">{{ $t('remarks') }}</div>
          <q-input
            v-model="createDto.remarks"
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
              />
            </div>
            <ValidationInput
              v-else
              :label="attribute.languages[i18n.locale.value]"
              v-model="createDto.customValues[attribute.number]"
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
import { SelectOption } from 'src/models/SelectOption';
import { CustomAttribute, CustomOption, DisplayType } from 'src/modules/customs/models/CustomAttribute';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import ValidationInput from 'src/components/ValidationInput.vue';
import { partService } from '../services/PartService';
import { partValidationService } from '../services/PartValidateService';
import { useViewTypeOptionsStore } from '../stores/ViewTypeOptionsStore';
import { Part, ViewType, ViewTypeOption } from '../models/Part';
import { CreatePartDTO } from '../dtos/CreatePartDTO';

const i18n = useI18n();

const attrLinksStore = useAttributeLinksStore();

const viewTypeOptionsStore = useViewTypeOptionsStore();

const formRef = ref<QForm>({} as QForm);

const viewTypeOption = ref<ViewTypeOption>({} as ViewTypeOption);

const infoExpanded = ref(true);

const customValuesExpanded = ref(true);

const initializing = ref(false);

const middleCustomOptions = ref<Record<number, string>>({} as Record<number, string>);

const createDto = ref<CreatePartDTO>({
  number: '',
  name: '',
  viewType: ViewType.Design,
  remarks: '',
  customValues: {},
});

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  onSuccess?:((part: Part) => void),
  onError?:(() => void),
}>(), {
});

const targetAttributes = computed(
  (): CustomAttribute[] => attrLinksStore.attributes(ObjectTypeId.PartVersion),
);

function onViewTypeUpdated(value: ViewTypeOption) {
  createDto.value.viewType = value.value;
}

async function createPart(): Promise<void> {
  const newPart = await partService.create(createDto.value);
  if (newPart && props.onSuccess) {
    props.onSuccess(newPart);
  } else if (!newPart && props.onError) {
    props.onError();
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
  createDto.value.customValues[selectOption.attributeNumber] = selectOption.value;
}

function updateSingleSelectAttribute() {
  targetAttributes.value.forEach((attr) => {
    if (attr.displayType === DisplayType.SingleSelect) {
      // Get option by single select value
      const targetOption = attr.options[0];
      middleCustomOptions.value[attr.id] = targetOption.languages[i18n.locale.value]
          || targetOption.value;
    }
  });
}

function resetDto() {
  createDto.value = {
    number: '',
    name: '',
    viewType: ViewType.Design,
    remarks: '',
    customValues: {},
  };
}

/**
 * Submit form
 */
function submit(): void {
  formRef.value.submit();
}

watch(() => i18n.locale.value, () => {
  updateSingleSelectAttribute();
});

onBeforeMount(async () => {
  initializing.value = true;
  resetDto();
  await attrLinksStore.initialize(ObjectTypeId.PartVersion);
  const option = viewTypeOptionsStore.i18nOptions[0];
  viewTypeOption.value = option;
  createDto.value.customValues = Object.fromEntries(targetAttributes.value.map((attr) => [attr.number, '']));
  updateSingleSelectAttribute();
  initializing.value = false;
});

defineExpose({
  submit,
});
</script>
