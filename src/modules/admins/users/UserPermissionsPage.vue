<template>
  <div class="q-pa-sm main-panel">123</div>
</template>

<script setup lang="ts">
import { Permission } from 'src/modules/permissions/models/Permission';
import { permissionService } from 'src/modules/permissions/services/PermissionService';
import { onBeforeMount, ref } from 'vue';

const permissions = ref<Permission[]>([]);

const props = defineProps<{
  id: string,
}>();

onBeforeMount(async () => {
  const targetPermissions = await permissionService.getByUserId(Number(props.id));
  if (targetPermissions) {
    permissions.value = targetPermissions;
  }
});
</script>
