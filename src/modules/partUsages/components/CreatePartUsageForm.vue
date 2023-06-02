<template>
  <div v-if="!initializing">
    <q-form
      ref="formRef"
      @submit="createPartUsage"
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
          v-model="usageChildDTO.quantity"
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
              v-model="usageChildDTO.customValues[attribute.number]"
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
import { Part } from 'src/modules/parts/models/Part';
import ValidationInput from 'src/components/ValidationInput.vue';
import { useAttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { CustomAttribute, CustomOption, DisplayType } from 'src/modules/customs/models/CustomAttribute';
import { SelectOption } from 'src/models/SelectOption';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { CreatePartUsageChildDTO, CreatePartUsagesDTO } from '../dtos/CreatePartUsagesDTO';
import { partUsageService } from '../services/PartUsageService';
import { PartUsageChild } from '../models/PartUsageUses';
import { partUsageValiationService } from '../services/PartUsageValidateService';

const i18n = useI18n();

const attrLinksStore = useAttributeLinksStore();

const formRef = ref<QForm>({} as QForm);

const infoExpanded = ref(true);

const customValuesExpanded = ref(true);

const middleCustomOptions = ref<Record<number, string>>({} as Record<number, string>);

const initializing = ref(false);

const targetAttributes = computed(
  (): CustomAttribute[] => attrLinksStore.attributes(ObjectTypeId.PartUsage),
);

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  readonly: boolean,
  parentPartVersionId: number,
  partChild: Part,
  onSuccess?:((usages: PartUsageChild[]) => void),
  onError?:(() => void),
}>(), {
  readonly: true,
  parentPartVersionId: 0,
});

const usageChildDTO = ref<CreatePartUsageChildDTO>({
  partId: 0,
  quantity: 1,
  customValues: {},
});

function getSelectOption(customOptions: CustomOption[], attributeNumber: string) {
  return customOptions.map((option): SelectOption<string> => ({
    label: option.languages[i18n.locale.value],
    value: option.key,
    attributeNumber,
  }));
}

function onSelectOptionUpdated(selectOption: SelectOption<string>) {
  usageChildDTO.value.customValues[selectOption.attributeNumber] = selectOption.value;
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

async function createPartUsage(): Promise<void> {
  const createDto: CreatePartUsagesDTO = {
    partVersionId: props.parentPartVersionId,
    children: [usageChildDTO.value],
  };
  const usages = await partUsageService.insert(createDto);
  if (usages && props.onSuccess) {
    props.onSuccess(usages);
  } else if (!usages && props.onError) {
    props.onError();
  }
}

/**
 * Submit form
 */
function submit(): void {
  formRef.value.submit();
}

watch(() => props.partChild, () => {
  usageChildDTO.value.partId = props.partChild.id;
  updateSingleSelectAttribute();
});

watch(() => i18n.locale.value, () => {
  updateSingleSelectAttribute();
});

onBeforeMount(async () => {
  initializing.value = true;
  usageChildDTO.value.partId = props.partChild.id;
  await attrLinksStore.initialize(ObjectTypeId.PartUsage);
  usageChildDTO.value.customValues = Object.fromEntries(targetAttributes.value.map((attr) => [attr.number, '']));
  updateSingleSelectAttribute();
  initializing.value = false;
});

defineExpose({
  submit,
});
</script>
