<template>
  <div>
    <div class="q-mx-sm text-caption">{{ label }}</div>
    <q-input
      v-model="inputValue"
      dense
      filled
      :type="props.type"
      :rules="[
        val => inputValidator ? inputValidator(val) : true
      ]"
      :readonly="readonly"
      hide-bottom-space
    />
  </div>
</template>

<script setup lang="ts">
import { QInputProps } from 'quasar';
import { computed } from 'vue';

const props = defineProps<{
  label?: string,
  type?: QInputProps['type'],
  inputValidator?:((val: string) => string | boolean),
  readonly?: boolean,
  modelValue?: string | number | undefined,
}>();

type Emit = {
  (e: 'update:modelValue', value: string | number | undefined): void,
}
const emit = defineEmits<Emit>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
