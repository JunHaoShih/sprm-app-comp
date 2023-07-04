<template>
  <q-tabs
    align="justify"
    inline-label
    indicator-color="orange"
    active-bg-color="grey-4"
    class="tabs-font q-ma-sm main-panel tabs-header"
  >
    <q-route-tab
      icon="handyman"
      :label="$t('customs.attributes.title')"
      to="/customizations/attributes"
      exact
    />
    <q-route-tab
      icon="link"
      :label="$t('customs.attributeLinks.title')"
      to="/customizations/attributeLinks"
      exact
    />
  </q-tabs>
  <router-view />
</template>

<script setup lang="ts">

</script>

<style lang="sass" scoped>
.tabs-font
  font-family: 'Noto Sans TC'
</style>
