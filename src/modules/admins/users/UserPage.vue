<template>
  <div class="q-pa-sm">
    <q-breadcrumbs class="text-primary" active-color="black">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el :label="$t('admins.title')" icon="widgets" to="/admin" />
      <q-breadcrumbs-el :label="$t('users.title')" icon="widgets" to="/admin/users" />
      <q-breadcrumbs-el
        :label="userStore.appUser.username"
        icon="person"
        :to="`/admin/users/${id}/info`"
      />
    </q-breadcrumbs>
    <q-separator color="black" class="q-mt-sm"/>
    <AppUserBanner
      :appUser="userStore.appUser"
    />
    <q-tabs
      align="justify"
      inline-label
      indicator-color="orange"
      active-bg-color="grey-4"
      class="q-mx-sm tabs-header"
    >
      <q-route-tab
        icon="info"
        :label="$t('info')"
        :to="`/admin/users/${id}/info`"
        exact
      />
      <q-route-tab
        icon="manage_accounts"
        :label="$t('permissions.management')"
        :to="`/admin/users/${id}/permissions`"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import AppUserBanner from 'src/modules/appUsers/components/AppUserBanner.vue';
import { appUserService } from 'src/modules/appUsers/services/AppUserService';
import { useUserStore } from 'src/modules/appUsers/stores/AppUserStore';
import { onBeforeMount } from 'vue';

const userStore = useUserStore();

const props = defineProps<{
  id: string,
}>();

onBeforeMount(async () => {
  const targetUser = await appUserService.getById(Number(props.id));
  if (targetUser) {
    userStore.appUser = targetUser;
  }
});
</script>
