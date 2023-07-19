<template>
  <div class="q-pa-sm">
    <q-breadcrumbs class="text-primary" active-color="black">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el :label="$t('admins.title')" icon="widgets" to="/admin" />
      <q-breadcrumbs-el :label="$t('users.title')" icon="widgets" to="/admin/users" />
      <q-breadcrumbs-el :label="user.username" icon="person" :to="`/admin/users/${id}`" />
    </q-breadcrumbs>
    <q-separator color="black" class="q-mt-sm"/>
  </div>
</template>

<script setup lang="ts">
import { AppUser } from 'src/modules/appUsers/models/AppUser';
import { appUserService } from 'src/modules/appUsers/services/AppUserService';
import { onBeforeMount, ref } from 'vue';

const user = ref<AppUser>({} as AppUser);

const props = defineProps<{
  id: string,
}>();

onBeforeMount(async () => {
  const targetUser = await appUserService.getById(Number(props.id));
  if (targetUser) {
    user.value = targetUser;
  }
});
</script>
