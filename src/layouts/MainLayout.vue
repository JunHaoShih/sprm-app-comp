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
        <q-btn
          v-if="isAdminPanelDisplay"
          :label="$t('admins.title')"
          to="/admin"
          class="action-btn q-mr-md"
        ></q-btn>
        <q-avatar>
          <img :src="currentUserStore.getGravatar" alt="icon">
          <q-menu>
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="currentUserStore.getGravatar" alt="icon">
                </q-avatar>
              </q-item-section>
              <q-item-section>{{ currentUserStore.appUser.username }}</q-item-section>
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
      :width="drawerWidth"
      :mini="!leftDrawerOpen || miniState"
      @click.capture="drawerClick"
    >
      <q-scroll-area style="width: inherit; height: calc(100vh - 55px);">
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
      </q-scroll-area>
      <q-separator/>
      <q-list>
        <NavItem
          v-if="miniState === false"
          :navNode="collapseNode"
          class="q-mini-drawer-hide"
          @click="miniState = true"
        />
        <NavItem
          v-else
          :navNode="expandNode"
        />
      </q-list>
      <!-- drawer resizer -->
      <!-- https://github.com/quasarframework/quasar/issues/7099 -->
      <div
        v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeDrawer"
        class="q-drawer__resizer"
      ></div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useCurrentUserStore } from 'src/modules/appUsers/stores/CurrentUserStore';
import NavItem, { NavNode } from 'src/components/navItem/NavItem.vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';

const i18n = useI18n();

const route = useRoute();

const router = useRouter();

const currentUserStore = useCurrentUserStore();

let initialDrawerWidth = 0;

const drawerMaxWidth = 600;

const drawerWidth = ref(300);

type RootType = 'main' | 'admin';

const rootType = ref<RootType>('main');

const isAdminPanelDisplay = computed(
  () => currentUserStore.appUser.isAdmin && rootType.value === 'main',
);

const collapseNode = computed(
  (): NavNode => ({
    title: i18n.t('sideBars.collapse'),
    icon: 'keyboard_double_arrow_left',
  }),
);
const expandNode = computed(
  (): NavNode => ({
    title: '',
    icon: 'keyboard_double_arrow_right',
  }),
);

const mainLinks = computed(
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
      icon: 'arrow_forward',
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

const adminLinks = computed(
  (): NavNode[] => [
    {
      title: i18n.t('users.title'),
      caption: i18n.t('users.caption'),
      icon: 'person',
      to: '/admin/users',
    },
  ],
);

const essentialLinks = computed(
  () => {
    if (rootType.value === 'main') {
      return mainLinks.value;
    }
    return adminLinks.value;
  },
);

const leftDrawerOpen = ref(true);

const miniState = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function setLanguage(lang: string): void {
  i18n.locale.value = lang;
}

async function onLogoutClicked(): Promise<void> {
  await currentUserStore.logout();
  router.push('/login');
}

function drawerClick(): void {
  if (miniState.value) {
    miniState.value = false;
  }
}

function linksInit(path: string) {
  if (path.startsWith('/admin')) {
    rootType.value = 'admin';
  } else {
    rootType.value = 'main';
  }
}

function resizeDrawer(details: {
  isFirst: boolean,
  offset: {
    x: number,
    y: number,
  },
}) {
  if (details.isFirst) {
    initialDrawerWidth = drawerWidth.value;
  }
  drawerWidth.value = Math.min(initialDrawerWidth + details.offset.x, drawerMaxWidth);
}

onBeforeRouteLeave((to) => {
  linksInit(to.path);
});

onBeforeMount(() => {
  linksInit(route.path);
});
</script>

<style lang="sass" scoped>
.q-drawer__resizer
  position: absolute
  top: 0
  bottom: 0
  right: -2px
  width: 1px
  background-color: $grey-5
  cursor: ew-resize

  &:after
    content: ''
    position: absolute
    top: 50%
    height: 30px
    left: -2px
    right: -2px
    transform: translateY(-50%)
    background-color: $accent
    border-radius: 4px
</style>
