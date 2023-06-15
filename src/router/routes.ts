import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/parts',
        component: () => import('src/modules/parts/PartsPage.vue'),
      },
      {
        path: '/parts/:id',
        component: () => import('src/modules/parts/PartCenterPage.vue'),
        props: true,
        children: [
          {
            path: '/parts/:id/history',
            component: () => import('src/modules/parts/PartHistoryPage.vue'),
            props: true,
          },
          {
            path: '/parts/:id/routing',
            component: () => import('src/modules/routings/RoutingPage.vue'),
            props: true,
          },
        ],
      },
      {
        path: '/parts/version/:id',
        component: () => import('src/modules/parts/PartVersionCenterPage.vue'),
        props: true,
        children: [
          { path: '/parts/version/:id/info', component: () => import('src/modules/parts/PartInfoPage.vue') },
          { path: '/parts/version/:id/usages', component: () => import('src/modules/partUsages/PartUsagesPage.vue'), props: true },
        ],
      },
      {
        path: '/parts/version/edit/:id',
        component: () => import('src/modules/parts/PartVersionEditCenterPage.vue'),
        props: true,
        children: [
          { path: '/parts/version/edit/:id/info', component: () => import('src/modules/parts/PartInfoEditPage.vue'), props: true },
          { path: '/parts/version/edit/:id/usages', component: () => import('src/modules/partUsages/PartUsagesEditPage.vue'), props: true },
        ],
      },
      {
        path: '/customizations',
        component: () => import('src/modules/customs/CustomPage.vue'),
        children: [
          { path: '/customizations/attributes', component: () => import('src/modules/customs/CustomAttributesPage.vue') },
          { path: '/customizations/attributeLinks', component: () => import('src/modules/customs/AttributeLinksPage.vue') },
        ],
      },
    ],
  },
  {
    path: '/login',
    component: () => import('src/modules/authentications/LoginPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
