<template>
  <div>
    <div
      v-for="version in partVersions"
      v-bind:key="version.id"
    >
      {{ version.version }} - {{ version.updateDate }} - {{ version.updateUser }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationResponse } from 'src/models/paginations/OffsetPaginationResponse';
import { partVersionService } from './services/PartVersionService';
import { PartVersion } from './models/PartVersion';

const partVersions = ref<PartVersion[]>([]);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

const paginationInput = ref<OffsetPaginationInput>({
  page: 1,
  perPage: 20,
});

const paginationResponse = ref<OffsetPaginationResponse>({
  page: 1,
  perPage: 20,
  total: 0,
  totalPages: 0,
});

onBeforeMount(async () => {
  const versionsPagination = await partVersionService
    .getPartVersions(Number(props.id), paginationInput.value);
  if (versionsPagination) {
    partVersions.value = versionsPagination.content;
    paginationResponse.value = versionsPagination.pagination;
  }
});
</script>
