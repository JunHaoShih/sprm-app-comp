<template>
  <q-tabs
    align="left"
    indicator-color="orange"
    class="tabs-font main-panel"
  >
    <q-route-tab
      :label="$t('customs.attributes.title')"
      to="/customizations/attributes"
      exact
    />
    <q-route-tab
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
