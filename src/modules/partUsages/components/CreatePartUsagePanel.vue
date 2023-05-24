<template>
  <div>{{ parentPartVersionId }}</div>
  <div>{{ usageChildDTO.id }}</div>
  <div>{{ usageChildDTO.quantity }}</div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { Part } from 'src/modules/parts/models/Part';
import { CreatePartUsageChildDTO } from '../dtos/CreatePartUsagesDTO';

/**
 * Define props with default value
 */
const props = withDefaults(defineProps<{
  parentPartVersionId: number,
  partChild: Part,
}>(), {
  parentPartVersionId: 0,
});

const usageChildDTO = ref<CreatePartUsageChildDTO>({
  id: 0,
  quantity: 0,
  customValues: {},
});

watch(() => props.partChild, () => {
  usageChildDTO.value.id = props.partChild.id;
});

onBeforeMount(() => {
  usageChildDTO.value.id = props.partChild.id;
});
</script>
