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
            component: () => import('src/modules/routings/RoutingsPage.vue'),
            props: true,
          },
        ],
      },
      {
        path: '/routings/:id',
        component: () => import('src/modules/routings/RoutingCenterPage.vue'),
        props: true,
        children: [
          {
            path: '/routings/:id/history',
            component: () => import('src/modules/routings/RoutingHistoryPage.vue'),
            props: true,
          },
        ],
      },
      {
        path: '/routings/version/edit/:id',
        component: () => import('src/modules/routings/RoutingVersionEditCenterPage.vue'),
        props: true,
        children: [
          { path: '/routings/version/edit/:id/info', component: () => import('src/modules/routings/RoutingInfoEditPage.vue') },
          { path: '/routings/version/edit/:id/usages', component: () => import('src/modules/routingUsages/RoutingUsagesEditPage.vue'), props: true },
        ],
      },
      {
        path: '/routings/version/:id',
        component: () => import('src/modules/routings/RoutingVersionCenterPage.vue'),
        props: true,
        children: [
          { path: '/routings/version/:id/info', component: () => import('src/modules/routings/RoutingInfoPage.vue') },
          { path: '/routings/version/:id/usages', component: () => import('src/modules/routingUsages/RoutingUsagesPage.vue'), props: true },
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
      {
        path: '/processes',
        component: () => import('src/modules/processes/ProcessesPage.vue'),
      },
      {
        path: '/processes/:id',
        component: () => import('src/modules/processes/ProcessCenterPage.vue'),
        props: true,
        children: [
          { path: '/processes/:id/info', component: () => import('src/modules/processes/ProcessPage.vue'), props: true },
        ],
      },
      {
        path: '/processes/edit/:id',
        component: () => import('src/modules/processes/ProcessEditCenterPage.vue'),
        props: true,
        children: [
          { path: '/processes/edit/:id/info', component: () => import('src/modules/processes/ProcessEditPage.vue'), props: true },
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
