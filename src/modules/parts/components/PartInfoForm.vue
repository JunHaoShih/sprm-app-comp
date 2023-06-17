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

              <CustomAttributesInputPanel
                v-model="partVersion.customValues"
                :sprmObjectType="sprmObjectType"
                :readonly="readonly"
              ></CustomAttributesInputPanel>
            </div>
          </q-scroll-area>
          <slot name="after"></slot>
        </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import ValidationInput from 'src/components/ValidationInput.vue';
import CustomAttributesInputPanel from 'src/components/CustomAttributesInputPanel.vue';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { QForm } from 'quasar';
import { useI18n } from 'vue-i18n';
import { partValidationService } from '../services/PartValidateService';
import { useViewTypeOptionsStore } from '../stores/ViewTypeOptionsStore';
import { ViewTypeOption } from '../models/Part';
import { PartVersion } from '../models/PartVersion';

const i18n = useI18n();

const viewTypeOptionsStore = useViewTypeOptionsStore();

const formRef = ref<QForm>({} as QForm);

const viewTypeOption = ref<ViewTypeOption>({} as ViewTypeOption);

const infoExpanded = ref(true);

const initializing = ref(true);

const sprmObjectType = SprmObjectType.PartVersion;

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

watch(() => i18n.locale.value, () => {
  viewTypeInit();
});

onBeforeMount(async () => {
  initializing.value = true;
  viewTypeInit();
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
