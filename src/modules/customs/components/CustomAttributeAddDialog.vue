<template>
  <div>
    <PopupDialog
      v-model="prompt"
      :title="$t('customs.attributes.new')"
    >
      <template v-slot:center>
        <!-- info area -->
        <CustomAttributeForm
          ref="formRef"
          :on-submit="addAttribute"
          v-model="defaultAttr"
          :readonly="readonly"
        />
      </template>
      <template v-slot:bottom>
        <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
        <q-btn flat :label="$t('actions.confirm')" @click="submit"></q-btn>
      </template>
    </PopupDialog>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { availableLocales } from 'src/models/Locale';
import PopupDialog from 'src/components/PopupDialog.vue';
import CustomAttributeForm from './CustomAttributeForm.vue';
import { AttributeType, CustomAttribute, DisplayType } from '../models/CustomAttribute';
import { customAttributeService } from '../services/CustomAttributeService';
import { useCustomAttributesStore } from '../stores/CustomAttributesStore';
import { CreateCustomAttributeDTO } from '../dtos/CreateCustomAttributeDTO';

const i18n = useI18n();

const $q = useQuasar();

const customAttributesStore = useCustomAttributesStore();

const formRef = ref<InstanceType<typeof CustomAttributeForm> | null>(null);

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

function submit() {
  formRef.value?.submit();
}

async function addAttribute(): Promise<void> {
  const createDTO: CreateCustomAttributeDTO = JSON.parse(JSON.stringify(defaultAttr.value));
  const newAttr = await customAttributeService.create(createDTO);
  if (!newAttr) {
    return;
  }

  customAttributesStore.addAttribute(newAttr);
  $q.notify({
    type: 'success',
    message: `${newAttr.number} ${i18n.t('actions.inserts.success')}`,
  });
  prompt.value = false;
}

onBeforeMount(() => {
  initialize();
});
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
