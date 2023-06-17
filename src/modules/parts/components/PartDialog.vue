<template>
  <PopupDialog
    v-model="prompt"
    :title="$t('parts.new')"
  >
    <template v-slot:center>
      <CreatePartForm
        ref="formRef"
        :on-success="onDialogConfirm"
      />
    </template>
    <template v-slot:bottom>
      <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
      <q-btn flat :label="$t('actions.confirm')" @click="submit"></q-btn>
    </template>
  </PopupDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import PopupDialog from 'src/components/PopupDialog.vue';
import CreatePartForm from './CreatePartForm.vue';
import { Part } from '../models/Part';

const $q = useQuasar();

const i18n = useI18n();

const formRef = ref<InstanceType<typeof CreatePartForm>>();

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

function submit() {
  formRef.value?.submit();
}

async function onDialogConfirm(newPart: Part): Promise<void> {
  emit('onPartCreated', newPart);
  $q.notify({
    message: `${newPart.number} ${i18n.t('actions.inserts.success')}`,
    color: 'secondary',
    icon: 'check_circle',
  });
  prompt.value = false;
}
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
