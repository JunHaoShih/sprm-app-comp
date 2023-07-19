import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { RoutePermission } from 'src/modules/permissions/models/Permission';
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
        meta: {
          permissions: [
            { objectType: SprmObjectType.PartVersion, cruds: ['read'] },
          ] as RoutePermission[],
        },
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
            meta: {
              permissions: [
                { objectType: SprmObjectType.PartVersion, cruds: ['read'] },
              ] as RoutePermission[],
            },
          },
          {
            path: '/parts/:id/routing',
            component: () => import('src/modules/routings/RoutingsPage.vue'),
            props: true,
            meta: {
              permissions: [
                { objectType: SprmObjectType.RoutingVersion, cruds: ['read'] },
              ] as RoutePermission[],
            },
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
        meta: {
          permissions: [
            { objectType: SprmObjectType.RoutingVersion, cruds: ['read'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/routings/version/edit/:id',
        component: () => import('src/modules/routings/RoutingVersionEditCenterPage.vue'),
        props: true,
        children: [
          { path: '/routings/version/edit/:id/info', component: () => import('src/modules/routings/RoutingInfoEditPage.vue') },
          { path: '/routings/version/edit/:id/usages', component: () => import('src/modules/routingUsages/RoutingUsagesEditPage.vue'), props: true },
        ],
        meta: {
          permissions: [
            { objectType: SprmObjectType.RoutingVersion, cruds: ['update'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/routings/version/:id',
        component: () => import('src/modules/routings/RoutingVersionCenterPage.vue'),
        props: true,
        children: [
          { path: '/routings/version/:id/info', component: () => import('src/modules/routings/RoutingInfoPage.vue') },
          { path: '/routings/version/:id/usages', component: () => import('src/modules/routingUsages/RoutingUsagesPage.vue'), props: true },
        ],
        meta: {
          permissions: [
            { objectType: SprmObjectType.RoutingVersion, cruds: ['read'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/parts/version/:id',
        component: () => import('src/modules/parts/PartVersionCenterPage.vue'),
        props: true,
        children: [
          { path: '/parts/version/:id/info', component: () => import('src/modules/parts/PartInfoPage.vue') },
          { path: '/parts/version/:id/usages', component: () => import('src/modules/partUsages/PartUsagesPage.vue'), props: true },
        ],
        meta: {
          permissions: [
            { objectType: SprmObjectType.PartVersion, cruds: ['read'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/parts/version/edit/:id',
        component: () => import('src/modules/parts/PartVersionEditCenterPage.vue'),
        props: true,
        children: [
          {
            path: '/parts/version/edit/:id/info',
            component: () => import('src/modules/parts/PartInfoEditPage.vue'),
            props: true,
            meta: {
              permissions: [
                { objectType: SprmObjectType.PartVersion, cruds: ['update'] },
              ] as RoutePermission[],
            },
          },
          {
            path: '/parts/version/edit/:id/usages',
            component: () => import('src/modules/partUsages/PartUsagesEditPage.vue'),
            props: true,
            meta: {
              permissions: [
                { objectType: SprmObjectType.PartUsage, cruds: ['update'] },
              ] as RoutePermission[],
            },
          },
        ],
        meta: {
          permissions: [
            { objectType: SprmObjectType.PartVersion, cruds: ['update'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/customizations',
        component: () => import('src/modules/customs/CustomPage.vue'),
        children: [
          {
            path: '/customizations/attributes',
            component: () => import('src/modules/customs/CustomAttributesPage.vue'),
            meta: {
              permissions: [
                { objectType: SprmObjectType.CustomValue, cruds: ['read'] },
              ] as RoutePermission[],
            },
          },
          {
            path: '/customizations/attributeLinks',
            component: () => import('src/modules/customs/AttributeLinksPage.vue'),
            meta: {
              permissions: [
                { objectType: SprmObjectType.AttributeLink, cruds: ['read'] },
              ] as RoutePermission[],
            },
          },
        ],
      },
      {
        path: '/processes',
        component: () => import('src/modules/processes/ProcessesPage.vue'),
        meta: {
          permissions: [
            { objectType: SprmObjectType.Process, cruds: ['read'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/processes/:id',
        component: () => import('src/modules/processes/ProcessCenterPage.vue'),
        props: true,
        children: [
          {
            path: '/processes/:id/info',
            component: () => import('src/modules/processes/ProcessPage.vue'),
            props: true,
            meta: {
              permissions: [
                { objectType: SprmObjectType.Process, cruds: ['read'] },
              ] as RoutePermission[],
            },
          },
        ],
        meta: {
          permissions: [
            { objectType: SprmObjectType.Process, cruds: ['read'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/processes/edit/:id',
        component: () => import('src/modules/processes/ProcessEditCenterPage.vue'),
        props: true,
        children: [
          { path: '/processes/edit/:id/info', component: () => import('src/modules/processes/ProcessEditPage.vue'), props: true },
        ],
        meta: {
          permissions: [
            { objectType: SprmObjectType.Process, cruds: ['update'] },
          ] as RoutePermission[],
        },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/modules/admins/AdminHomePage.vue'),
      },
      {
        path: '/admin/users',
        component: () => import('src/modules/admins/users/UsersPage.vue'),
      },
      { path: '/admin/users/:id', component: () => import('src/modules/admins/users/UserPage.vue'), props: true },
    ],
    meta: {
      isAdmin: true,
    },
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
