<template>
  <div>
    <q-form
      ref="formRef"
      @submit="props.onSubmit"
      @validation-success="inputUsage = formUsage"
    >
      <q-expansion-item
        v-model="infoExpanded"
        icon="article"
        :label="$t('info')"
        header-class="text-h6 bg-secondary text-white"
        expand-icon-class="text-white"
        class="expandable shadow-1 overflow-hidden"
        style="border-radius: 10px"
      >
      <div class="q-pa-sm">
        <ValidationInput
          v-model="formUsage.number"
          type="text"
          :label="$t('parts.routings.processes.number')"
          :readonly="readonly"
          :input-validator="routingUsageValidationService.numberRules"
        />
        <ValidationInput
          v-model="formUsage.processNumber"
          :label="$t('processes.number')"
          :readonly="true"
        >
          <template v-slot:after>
            <q-btn
              icon="search"
              class="action-btn"
              style="width: 50px;"
              @click="onSearchClicked"
            />
          </template>
        </ValidationInput>
        <ValidationInput
          v-model="formUsage.processName"
          :label="$t('processes.name')"
          :readonly="true"
        />
        <div class="column q-pt-md">
          <q-input
            v-model="formUsage.remarks"
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
        v-model="formUsage.customValues"
        :sprmObjectType="sprmObjectType"
      ></CustomAttributesInputPanel>
    </q-form>
    <PopupDialog
      v-model="prompt"
      :title="$t('processes.search')"
    >
      <template v-slot:center>
        <ProcessesSearchPanel
          v-model="pattern"
          :readonly="true"
          v-model:selected="selectedProcesses"
          selection="single"
          class="main-panel"
          table-class="dialog-table"
        />
      </template>
      <template v-slot:bottom>
        <q-btn flat :label="$t('actions.cancel')" v-close-popup />
        <q-btn flat :label="$t('actions.confirm')" @click="onConfirm" />
      </template>
    </PopupDialog>
  </div>
</template>

<script setup lang="ts">
import { QForm, useQuasar } from 'quasar';
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { Process } from 'src/modules/processes/models/Process';
import CustomAttributesInputPanel from 'src/components/CustomAttributesInputPanel.vue';
import ValidationInput from 'src/components/ValidationInput.vue';
import PopupDialog from 'src/components/PopupDialog.vue';
import ProcessesSearchPanel from 'src/modules/processes/components/ProcessesSearchPanel.vue';
import { RoutingUsage } from '../models/RoutingUsage';
import { routingUsageValidationService } from '../services/RoutingUsageValidateService';

const $q = useQuasar();

const i18n = useI18n();

const formRef = ref<QForm>({} as QForm);

const initializing = ref(false);

const infoExpanded = ref(true);

const sprmObjectType = SprmObjectType.RoutingUsage;

const prompt = ref(false);

const pattern = ref('');

const selectedProcesses = ref<Process[]>([]);

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  readonly?: boolean,
  onSubmit?:(() => void),
  modelValue: RoutingUsage,
}>(), {
  readonly: true,
});

type Emit = {
  (e: 'update:modelValue', value: RoutingUsage): void
}
const emit = defineEmits<Emit>();

const inputUsage = computed({
  get: (): RoutingUsage => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const formUsage = ref<RoutingUsage>({} as RoutingUsage);

function initialize(): void {
  formUsage.value = JSON.parse(JSON.stringify(inputUsage.value));
}

function onSearchClicked() {
  prompt.value = true;
}

function onConfirm() {
  if (selectedProcesses.value.length !== 1) {
    $q.notify({
      message: i18n.t('parts.mustSelectOne'),
      color: 'red',
      icon: 'error',
    });
    return;
  }
  const selected = selectedProcesses.value[0];
  formUsage.value.processId = selected.id;
  formUsage.value.processNumber = selected.number;
  formUsage.value.processName = selected.name;
  prompt.value = false;
}

/**
 * Submit form
 */
function submit(): void {
  formRef.value.submit();
}

watch(() => inputUsage.value.id, () => {
  initialize();
});

onBeforeMount(async () => {
  initializing.value = true;
  initialize();
  initializing.value = false;
});

defineExpose({
  submit,
});
</script>
