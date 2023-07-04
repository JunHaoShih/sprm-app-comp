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
        header-class="info-card-header"
        class="info-card-body"
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
      <CustomAttributesInputPanel
        v-model="createDto.customValues"
        :sprmObjectType="sprmObjectType"
      ></CustomAttributesInputPanel>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { QForm } from 'quasar';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import ValidationInput from 'src/components/ValidationInput.vue';
import CustomAttributesInputPanel from 'src/components/CustomAttributesInputPanel.vue';
import { partService } from '../services/PartService';
import { partValidationService } from '../services/PartValidateService';
import { useViewTypeOptionsStore } from '../stores/ViewTypeOptionsStore';
import { Part, ViewType, ViewTypeOption } from '../models/Part';
import { CreatePartDTO } from '../dtos/CreatePartDTO';

const viewTypeOptionsStore = useViewTypeOptionsStore();

const formRef = ref<QForm>({} as QForm);

const viewTypeOption = ref<ViewTypeOption>({} as ViewTypeOption);

const infoExpanded = ref(true);

const initializing = ref(false);

const sprmObjectType = SprmObjectType.PartVersion;

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

onBeforeMount(async () => {
  initializing.value = true;
  resetDto();
  const option = viewTypeOptionsStore.i18nOptions[0];
  viewTypeOption.value = option;
  initializing.value = false;
});

defineExpose({
  submit,
});
</script>
