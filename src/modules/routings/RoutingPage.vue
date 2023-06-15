<template>
  <div class="q-pa-sm">
    <div
      v-for="routing in routings"
      :key="routing.id"
    >
      {{ routing.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { Routing } from './models/Routing';

const routings = ref<Routing[]>([]);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function initialize() {
  for (let i = 0; i < 100; i += 1) {
    routings.value.push({
      id: i,
      createUser: '123',
      createDate: new Date(),
      updateUser: '123',
      updateDate: new Date(),
      remarks: '',
      partId: 1,
      name: `Routing ${i}`,
      checkout: true,
    });
  }
}

watch(() => props.id, async () => {
  await initialize();
});

onBeforeMount(async () => {
  await initialize();
});
</script>
