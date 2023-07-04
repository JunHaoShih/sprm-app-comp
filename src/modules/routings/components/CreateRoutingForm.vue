<template>
  <div v-if="!initializing">
    <q-form
      ref="formRef"
      @submit="createRouting"
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
          v-model="createDto.name"
          :label="$t('parts.routings.name')"
          :inputValidator="routingValidationService.nameRules"
        />
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
import { CreateRoutingDTO } from '../dtos/CreateRoutingDTO';
import { Routing } from '../models/Routing';
import { routingService } from '../services/RoutingService';
import { routingValidationService } from '../services/RoutingValidationService';

const formRef = ref<QForm>({} as QForm);

const infoExpanded = ref(true);

const initializing = ref(false);

const sprmObjectType = SprmObjectType.RoutingVersion;

const createDto = ref<CreateRoutingDTO>({
  partId: 0,
  name: '',
  remarks: '',
  customValues: {},
});

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  partId: number,
  onSuccess?:((part: Routing) => void),
  onError?:(() => void),
}>(), {
});

async function createRouting(): Promise<void> {
  const newRouting = await routingService.create(createDto.value);
  if (newRouting && props.onSuccess) {
    props.onSuccess(newRouting);
  } else if (!newRouting && props.onError) {
    props.onError();
  }
}

function resetDto() {
  createDto.value = {
    partId: props.partId,
    name: '',
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

onBeforeMount(() => {
  initializing.value = true;
  resetDto();
  initializing.value = false;
});

defineExpose({
  submit,
});
</script>
