<template>
  <div class="q-pt-sm flex flex-center">
    <q-pagination
      v-model="pagination.page"
      color="grey-7"
      :max="paginationResponse.totalPages"
      max-pages="6"
      direction-links
      boundary-links
      active-color="dark"
    />
    <q-select
      v-model="pagination.page"
      :options="filteredPageOptions"
      hide-bottom-space
      dense
      @filter="filterFn"
      use-input
      style="width: 200px"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { QSelect } from 'quasar';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationResponse } from 'src/models/paginations/OffsetPaginationResponse';
import { computed, ref } from 'vue';

interface Props {
  modelValue: OffsetPaginationInput,
  responsePagination: OffsetPaginationResponse,
}
const props = withDefaults(defineProps<Props>(), {
});

type Emit = {
  (e: 'update:modelValue', value: OffsetPaginationInput): void
  (e: 'update:responsePagination', value: OffsetPaginationResponse): void
}
const emit = defineEmits<Emit>();

const pagination = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const paginationResponse = computed({
  get: () => props.responsePagination,
  set: (value) => emit('update:responsePagination', value),
});

const pageOptions = computed(
  () => {
    const options: number[] = [];
    for (let i = 1; i <= paginationResponse.value.totalPages; i += 1) {
      options.push(i);
    }
    return options;
  },
);

const filteredPageOptions = ref<number[]>([]);

function filterFn(val: string, update: (callbackFn: () => void,
  afterFn?: ((ref: QSelect) => void) | undefined) => void) {
  if (val === '') {
    update(() => {
      filteredPageOptions.value = pageOptions.value;
    });
    return;
  }
  update(() => {
    filteredPageOptions.value = pageOptions.value.filter((v) => v.toString().indexOf(val) > -1);
  });
}
</script>
