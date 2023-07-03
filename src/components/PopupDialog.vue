<template>
  <q-dialog
    v-model="prompt"
    persistent
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card style="min-width: 700px">
      <q-card-section
        class="bg-dark text-white row items-center"
      >
        <div class="text-h6">
          {{ props.title }}
        </div>
        <q-space/>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-separator />
      <q-card-section
        class="scroll dialog-inner-max"
      >
        <slot name="center"></slot>
      </q-card-section>
      <q-separator />
      <q-card-actions
        align="right"
        class="text-primary"
      >
        <slot name="bottom"></slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * Define props with default value
 */
const props = defineProps<{
  modelValue: boolean,
  title: string,
}>();

type Emit = {
  (e: 'update:modelValue', value: boolean): void
}
const emit = defineEmits<Emit>();

const prompt = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
