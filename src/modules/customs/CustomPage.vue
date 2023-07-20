<template>
  <div class="q-pa-sm">
    <q-breadcrumbs class="text-primary" active-color="black">
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el
        v-if="pageType === 'attributes'"
        :label="$t('customs.attributes.title')"
        icon="handyman"
        :to="'/customizations/attributes'"
      />
      <q-breadcrumbs-el
        v-if="pageType === 'links'"
        :label="$t('customs.attributeLinks.title')"
        icon="link"
        :to="'/customizations/attributeLinks'"
      />
    </q-breadcrumbs>
    <q-separator color="black" class="q-my-sm"/>
  </div>
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
import { onBeforeMount, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

const route = useRoute();

type PageType = 'attributes' | 'links';

const pageType = ref<PageType>('attributes');

function decidePageType(path: string) {
  if (path.includes('/attributes')) {
    pageType.value = 'attributes';
  } else if (path.includes('/attributeLinks')) {
    pageType.value = 'links';
  }
}

onBeforeRouteUpdate((to) => {
  decidePageType(to.path);
});

onBeforeMount(() => {
  decidePageType(route.path);
});
</script>

<style lang="sass" scoped>
.tabs-font
  font-family: 'Noto Sans TC'
</style>
