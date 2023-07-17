<template>
  <div class="q-pa-sm">
    <q-breadcrumbs class="text-primary" active-color="black">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el :label="$t('admins.title')" icon="widgets" to="/admin" />
    </q-breadcrumbs>
    <q-separator color="black" class="q-mt-sm"/>
  </div>
  <div class="row justify-center items-center center">
    <div class="self-center text-h1">( ｀・ω・´)</div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="sass">
.center
  height: calc( 100vh - 100px )
</style>
