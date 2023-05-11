<template>
  <div>
    <q-dialog
      v-model="prompt"
      persistent
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card style="min-width: 700px">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">{{ $t('parts.new') }}</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll dialog-inner-max">
          <q-stepper
            v-model="step"
            ref="stepper"
            color="primary"
            animated
          >
            <q-step
              :name="1"
              :title="$t('parts.new')"
              icon="settings"
              :done="step > 1"
            >
            <CreatePartPanel
              ref="createPartPanelRef"
            />
            </q-step>
            <q-step
              :name="2"
              title="Create an ad group"
              caption="Optional"
              icon="create_new_folder"
              :done="step > 2"
            >
              An ad group contains one or more ads which target a shared set of keywords.
            </q-step>
          </q-stepper>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
          <q-btn flat :label="$t('actions.confirm')"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CreatePartPanel, { ICreatePartPanel } from 'src/modules/parts/components/CreatePartPanel.vue';

const step = ref(1);

const createPartPanelRef = ref<ICreatePartPanel>({} as ICreatePartPanel);

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
}
const emit = defineEmits<Emit>();

const prompt = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<style lang="sass" scoped>

</style>
