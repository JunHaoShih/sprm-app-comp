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
                  v-model="routingVersion.master.name"
                  :label="$t('parts.routings.name')"
                  :inputValidator="routingValidationService.nameRules"
                  :readonly="true"
                />
                <div class="column">
                  <q-input
                    class="q-my-md"
                    v-model="routingVersion.remarks"
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
                v-model="routingVersion.customValues"
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
import { computed, onBeforeMount, ref } from 'vue';
import { QForm } from 'quasar';
import { RoutingVersion } from '../models/RoutingVersion';
import { routingValidationService } from '../services/RoutingValidationService';

const formRef = ref<QForm>({} as QForm);

const infoExpanded = ref(true);

const initializing = ref(true);

const sprmObjectType = SprmObjectType.PartVersion;

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  readonly: boolean,
  modelValue: RoutingVersion,
  onSubmit?:(() => void),
  panelClass?: string,
}>(), {
  readonly: true,
  panelClass: 'default-height',
});

type Emit = {
  (e: 'update:modelValue', value: RoutingVersion): void
}
const emit = defineEmits<Emit>();

const routingVersion = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

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

onBeforeMount(async () => {
  initializing.value = true;
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
