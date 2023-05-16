<template>
  <div>
    <div class="q-mx-sm text-caption">{{ label }}</div>
    <q-input
      v-model="inputValue"
      dense
      filled
      :error="isValueError()"
      :error-message="i18nErrorMessage"
      :readonly="readonly"
      hide-bottom-space
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

const props = defineProps<{
  label?: string,
  inputValidator?:((val: string) => string | undefined),
  readonly?: boolean,
  modelValue: string,
}>();

type Emit = {
  (e: 'update:modelValue', value: string): void,
}
const emit = defineEmits<Emit>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const errorMessage = ref('');

function isValueError(): boolean {
  if (!props.inputValidator) {
    return false;
  }
  const result = props.inputValidator(inputValue.value);
  if (result) {
    errorMessage.value = result;
    return true;
  }
  return false;
}

const i18nErrorMessage = computed(
  (): string => {
    const message = errorMessage.value ? i18n.t(errorMessage.value) : '';
    return message;
  },
);
</script>
