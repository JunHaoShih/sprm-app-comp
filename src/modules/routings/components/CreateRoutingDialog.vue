<template>
  <PopupDialog
    v-model="prompt"
    :title="$t('parts.routings.new')"
  >
    <template v-slot:center>
      <CreateRoutingForm
        ref="formRef"
        :partId="props.partId"
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
import CreateRoutingForm from './CreateRoutingForm.vue';
import { Routing } from '../models/Routing';

const $q = useQuasar();

const i18n = useI18n();

const formRef = ref<InstanceType<typeof CreateRoutingForm>>();

const props = withDefaults(defineProps<{
  modelValue: boolean,
  partId: number,
}>(), {});

type Emit = {
  (e: 'update:modelValue', value: boolean): void
  (e: 'onRoutingCreated', value: Routing): void
}
const emit = defineEmits<Emit>();

const prompt = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function submit() {
  formRef.value?.submit();
}

async function onDialogConfirm(newRouting: Routing): Promise<void> {
  emit('onRoutingCreated', newRouting);
  $q.notify({
    message: `${newRouting.name} ${i18n.t('actions.inserts.success')}`,
    color: 'secondary',
    icon: 'check_circle',
  });
  prompt.value = false;
}
</script>
