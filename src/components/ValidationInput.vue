<template>
  <div>
    <div class="q-mx-sm text-caption">{{ label }}</div>
    <q-input
      v-model="inputValue"
      dense
      filled
      :type="props.type"
      :error="isValueError()"
      :error-message="i18nErrorMessage"
      :readonly="readonly"
      hide-bottom-space
    />
  </div>
</template>

<script setup lang="ts">
import { QInputProps } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

const props = defineProps<{
  label?: string,
  type?: QInputProps['type'],
  inputValidator?:((val: string | number | undefined) => string[]),
  readonly?: boolean,
  modelValue: string | number | undefined,
}>();

type Emit = {
  (e: 'update:modelValue', value: string | number | undefined): void,
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
  if (result.length > 0) {
    const message = result[0];
    errorMessage.value = message;
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
