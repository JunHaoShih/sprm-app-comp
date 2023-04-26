<template>
  <div>
    <!-- action bar -->
    <q-dialog ref="dialogRef" v-model="prompt" persistent
      transition-show="rotate" transition-hide="rotate"
    >
      <q-card style="min-width: 700px">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ $t('customs.attributes.new') }}</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll dialog-inner-max">
          <!-- info area -->
          <CustomAttributePanel
            v-model="defaultAttr"
            :readonly="readonly"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
          <q-btn flat :label="$t('actions.confirm')" @click="onConfirmClicked"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { QDialog, useQuasar } from 'quasar';
import { availableLocales } from 'src/models/Locale';
import CustomAttributePanel from './CustomAttributePanel.vue';
import { AttributeType, CustomAttribute, DisplayType } from '../models/CustomAttribute';
import { customAttributeService } from '../services/CustomAttributeService';
import { customAttributeValidationService } from '../services/CustomAttributeValidationService';
import { useCustomAttributesStore } from '../stores/CustomAttributesStore';
import { CreateCustomAttributeDTO } from '../dtos/CreateCustomAttributeDTO';

const i18n = useI18n();

const $q = useQuasar();

const customAttributesStore = useCustomAttributesStore();

const props = defineProps<{
  modelValue: boolean,
}>();

type Emit = {
  (e: 'update:modelValue', value: boolean): void
}
const emit = defineEmits<Emit>();

const prompt = computed({
  get: (): boolean => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const defaultAttr = ref<CustomAttribute>({} as CustomAttribute);

const readonly = ref(false);

const dialogRef = ref<QDialog>({} as QDialog);

function initialize(): void {
  defaultAttr.value = {
    number: '',
    name: '',
    languages: Object.fromEntries(availableLocales.map((locale) => [locale, ''])),
    attributeType: AttributeType.String,
    displayType: DisplayType.Value,
    isDisabled: false,
    options: [],
    remarks: '',
    id: 0,
    isSystemDefault: false,
    createUser: '',
    createDate: new Date(),
    updateUser: '',
    updateDate: new Date(),
  };
}

watch(prompt, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    initialize();
  }
});

async function onConfirmClicked(): Promise<void> {
  const createDTO: CreateCustomAttributeDTO = JSON.parse(JSON.stringify(defaultAttr.value));
  const result = customAttributeValidationService.checkCreateAttributeRules(createDTO);
  if (result) {
    $q.notify({
      message: `Error: ${i18n.t(result)}`,
      color: 'red',
    });
    return;
  }
  const newAttr = await customAttributeService.create(createDTO);
  if (!newAttr) {
    return;
  }

  customAttributesStore.addAttribute(newAttr);
  $q.notify({
    message: `${newAttr.number} ${i18n.t('actions.inserts.success')}`,
    color: 'secondary',
  });
  dialogRef.value.hide();
}

onBeforeMount(() => {
  initialize();
});
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
