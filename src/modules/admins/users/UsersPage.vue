<template>
  <div class="q-pa-sm">
    <q-breadcrumbs class="text-primary" active-color="black">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el :label="$t('admins.title')" icon="widgets" to="/admin" />
      <q-breadcrumbs-el :label="$t('users.title')" icon="widgets" to="/admin/users" />
    </q-breadcrumbs>
    <q-separator color="black" class="q-mt-sm"/>
    <AppUsersSearchPanel
      v-model="pattern"
      :readonly="true"
      v-model:selected="selected"
      selection="multiple"
      class="main-panel sticky-header-table"
      table-class="outer-max"
      @on-search="onSearch"
    >
      <template v-slot:table-top>
        <q-btn
          :label="$t('actions.add')"
          class="action-btn"
          @click="prompt = true"
        />
      </template>
    </AppUsersSearchPanel>
    <CreateAppUserDialog
      v-model="prompt"
      @onAppUserCreated="addAppUser"
    ></CreateAppUserDialog>
  </div>
</template>

<script setup lang="ts">
import AppUsersSearchPanel from 'src/modules/appUsers/components/AppUsersSearchPanel.vue';
import CreateAppUserDialog from 'src/modules/appUsers/components/CreateAppUserDialog.vue';
import { AppUser } from 'src/modules/appUsers/models/AppUser';
import { useUsersStore } from 'src/modules/appUsers/stores/AppUsersStore';
import { onBeforeMount, ref } from 'vue';
import {
  LocationQueryValue, onBeforeRouteUpdate, useRoute, useRouter,
} from 'vue-router';

const route = useRoute();

const router = useRouter();

const usersStore = useUsersStore();

const pattern = ref('');

const selected = ref<AppUser[]>([]);

const prompt = ref(false);

function onSearch(searchPattern: string) {
  pattern.value = searchPattern;
  router.push({
    path: '/admin/users',
    query: { pattern: searchPattern },
  });
}

function addAppUser(appUser: AppUser) {
  usersStore.unshiftAppUser(appUser);
}

async function updatePattern(queryValue: LocationQueryValue | LocationQueryValue[]) {
  const newPattern = queryValue as string;
  pattern.value = newPattern;
}

onBeforeRouteUpdate(async (to) => {
  await updatePattern(to.query.pattern);
});

onBeforeMount(async () => {
  await updatePattern(route.query.pattern);
});
</script>

<style lang="sass" scoped>
:deep(.outer-max)
  height: calc(100vh - 155px)
</style>
