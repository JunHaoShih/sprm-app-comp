<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar
        class="bg-dark"
      >
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ $t('title') }}
        </q-toolbar-title>
        <q-avatar>
          <img :src="currentUserStore.getGravatar" alt="icon">
          <q-menu>
            <q-item clickable v-close-popup>
              <q-item-section>{{ currentUserStore.username }}</q-item-section>
            </q-item>
            <q-separator />
            <!-- language -->
            <q-item clickable v-close-popup>
              <q-item-section @click="setLanguage('zh-TW')">{{ $t('lang.zhTW') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="setLanguage('en-US')">{{ $t('lang.enUS') }}</q-item-section>
            </q-item>
            <q-separator />
            <!-- logout -->
            <q-item clickable v-close-popup>
              <q-item-section @click="onLogoutClicked">{{ $t('logout') }}</q-item-section>
            </q-item>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>
    <q-ajax-bar/>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :mini="!leftDrawerOpen || miniState"
      @click.capture="drawerClick"
    >
      <q-list>
        <q-item-label
          header
        >
        {{ $t('menu') }}
        </q-item-label>
        <NavItem
          v-for="link in essentialLinks"
          :key="link.title"
          :navNode="link"
        />
      </q-list>
      <!--
        in this case, we use a button (can be anything)
        so that user can switch back
        to mini-mode
      -->
      <div class="q-mini-drawer-hide absolute" style="top: 55px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="accent"
          icon="chevron_left"
          @click="miniState = true"
        ></q-btn>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { CurrentUserStore } from 'src/modules/appUsers/stores/CurrentUserStore';
import NavItem, { NavNode } from 'src/components/navItem/NavItem.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const i18n = useI18n();

const router = useRouter();

const currentUserStore = CurrentUserStore();

const essentialLinks = computed(
  (): NavNode[] => [
    {
      title: i18n.t('parts.title'),
      caption: i18n.t('parts.caption'),
      icon: 'settings',
      to: '/parts',
    },
    {
      title: i18n.t('processes.title'),
      caption: i18n.t('processes.caption'),
      icon: 'route',
      to: '/processes',
    },
    {
      title: i18n.t('customs.title'),
      caption: i18n.t('customs.caption'),
      icon: 'tune',
      contentInsetLevel: 0.25,
      children: [
        {
          title: i18n.t('customs.attributes.title'),
          caption: i18n.t('customs.attributes.caption'),
          icon: 'handyman',
          to: '/customizations/attributes',
        },
        {
          title: i18n.t('customs.attributeLinks.title'),
          caption: i18n.t('customs.attributeLinks.caption'),
          icon: 'link',
          to: '/customizations/attributeLinks',
        },
      ],
    },
  ],
);

onBeforeMount(async () => {
  const currentUser = await currentUserStore.getCurrentUser();
  if (currentUser) {
    currentUserStore.$state = currentUser;
  }
});

const leftDrawerOpen = ref(true);

const miniState = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function setLanguage(lang: string): void {
  i18n.locale.value = lang;
}

function onLogoutClicked(): void {
  localStorage.removeItem('token');
  router.push('/login');
}

function drawerClick(): void {
  if (miniState.value) {
    miniState.value = false;
  }
}
</script>
