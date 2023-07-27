<template>
  <PopupDialog
    v-model="prompt"
    :title="$t('processes.new')"
  >
    <template v-slot:center>
      <CreateProcessForm
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
import CreateProcessForm from './CreateProcessForm.vue';
import { Process } from '../models/Process';

const $q = useQuasar();

const i18n = useI18n();

const formRef = ref<InstanceType<typeof CreateProcessForm>>();

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
  (e: 'onProcessCreated', value: Process): void
}
const emit = defineEmits<Emit>();

const prompt = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function submit() {
  formRef.value?.submit();
}

async function onDialogConfirm(newPart: Process): Promise<void> {
  emit('onProcessCreated', newPart);
  $q.notify({
    type: 'success',
    message: `${newPart.number} ${i18n.t('actions.inserts.success')}`,
  });
  prompt.value = false;
}
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
