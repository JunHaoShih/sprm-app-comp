<template>
  <div class="q-pa-sm">
    <q-breadcrumbs class="text-orange" active-color="secondary">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el :label="$t('admins.title')" icon="widgets" to="/admin" />
      <q-breadcrumbs-el :label="$t('users.title')" icon="widgets" to="/admin/users" />
    </q-breadcrumbs>
    <q-separator color="black" class="q-mt-sm"/>
    <div>Users</div>
  </div>
</template>

<script setup lang="ts">
</script>
