<template>
  <q-dialog ref="dialogRef" v-model="prompt" persistent
    transition-show="rotate" transition-hide="rotate"
  >
    <q-card style="min-width: 700px">
      <q-card-section class="bg-primary text-white row items-center">
        <div class="text-h6">{{ $t('parts.new') }}</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll dialog-inner-max">
        <CreatePartPanel
          ref="formRef"
          :on-success="onDialogConfirm"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
        <q-btn flat :label="$t('actions.confirm')" @click="submit"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QDialog, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import CreatePartPanel from './CreatePartPanel.vue';
import { Part } from '../models/Part';

const $q = useQuasar();

const i18n = useI18n();

const dialogRef = ref<QDialog>({} as QDialog);

const formRef = ref<InstanceType<typeof CreatePartPanel>>();

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
  dialogRef.value.hide();
}
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
