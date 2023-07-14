<template>
  <div>Admin home page</div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useCurrentUserStore } from '../appUsers/stores/CurrentUserStore';

const $q = useQuasar();

const i18n = useI18n();

const router = useRouter();

const currentUserStore = useCurrentUserStore();

onBeforeMount(async () => {
  if (!currentUserStore.appUser.isAdmin) {
    $q.notify({
      message: i18n.t('permissions.accessDenied'),
      color: 'red',
      icon: 'error',
    });
    await router.push('/');
  }
});
</script>
