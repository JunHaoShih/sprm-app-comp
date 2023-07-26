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
        component: () => import('pages/PartsPage.vue'),
        meta: {
          permissions: [
            { objectType: SprmObjectType.PartVersion, cruds: ['read'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/parts/:id',
        component: () => import('pages/parts/IdPage.vue'),
        props: true,
        children: [
          {
            path: '/parts/:id/history',
            component: () => import('pages/parts/{id}/PartHistoryPage.vue'),
            props: true,
            meta: {
              permissions: [
                { objectType: SprmObjectType.PartVersion, cruds: ['read'] },
              ] as RoutePermission[],
            },
          },
          {
            path: '/parts/:id/routing',
            component: () => import('pages/parts/{id}/RoutingsPage.vue'),
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
        component: () => import('pages/routings/RoutingIdPage.vue'),
        props: true,
        children: [
          {
            path: '/routings/:id/history',
            component: () => import('pages/routings/{routingId}/RoutingHistoryPage.vue'),
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
        component: () => import('pages/routings/version/edit/RoutingVersionIdEditPage.vue'),
        props: true,
        children: [
          { path: '/routings/version/edit/:id/info', component: () => import('pages/routings/version/edit/{versionId}/RoutingInfoEditPage.vue') },
          { path: '/routings/version/edit/:id/usages', component: () => import('pages/routings/version/edit/{versionId}/RoutingUsagesEditPage.vue'), props: true },
        ],
        meta: {
          permissions: [
            { objectType: SprmObjectType.RoutingVersion, cruds: ['update'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/routings/version/:id',
        component: () => import('pages/routings/version/RoutingVersionIdPage.vue'),
        props: true,
        children: [
          { path: '/routings/version/:id/info', component: () => import('pages/routings/version/{versionId}/RoutingInfoPage.vue') },
          { path: '/routings/version/:id/usages', component: () => import('pages/routings/version/{versionId}/RoutingUsagesPage.vue'), props: true },
        ],
        meta: {
          permissions: [
            { objectType: SprmObjectType.RoutingVersion, cruds: ['read'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/parts/version/:id',
        component: () => import('pages/parts/version/VersionIdPage.vue'),
        props: true,
        children: [
          { path: '/parts/version/:id/info', component: () => import('pages/parts/version/{versionId}/PartInfoPage.vue') },
          { path: '/parts/version/:id/usages', component: () => import('pages/parts/version/{versionId}/PartUsagesPage.vue'), props: true },
        ],
        meta: {
          permissions: [
            { objectType: SprmObjectType.PartVersion, cruds: ['read'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/parts/version/edit/:id',
        component: () => import('pages/parts/version/edit/VersionIdEditPage.vue'),
        props: true,
        children: [
          {
            path: '/parts/version/edit/:id/info',
            component: () => import('pages/parts/version/edit/{versionId}/PartInfoEditPage.vue'),
            props: true,
            meta: {
              permissions: [
                { objectType: SprmObjectType.PartVersion, cruds: ['update'] },
              ] as RoutePermission[],
            },
          },
          {
            path: '/parts/version/edit/:id/usages',
            component: () => import('pages/parts/version/edit/{versionId}/PartUsagesEditPage.vue'),
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
        component: () => import('pages/CustomizationsPage.vue'),
        children: [
          {
            path: '/customizations/attributes',
            component: () => import('pages/customizations/CustomAttributesPage.vue'),
            meta: {
              permissions: [
                { objectType: SprmObjectType.CustomAttribute, cruds: ['read'] },
              ] as RoutePermission[],
            },
          },
          {
            path: '/customizations/attributeLinks',
            component: () => import('pages/customizations/AttributeLinksPage.vue'),
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
        component: () => import('pages/ProcessesPage.vue'),
        meta: {
          permissions: [
            { objectType: SprmObjectType.Process, cruds: ['read'] },
          ] as RoutePermission[],
        },
      },
      {
        path: '/processes/:id',
        component: () => import('pages/processes/ProcessIdPage.vue'),
        props: true,
        children: [
          {
            path: '/processes/:id/info',
            component: () => import('pages/processes/{processId}/ProcessInfoPage.vue'),
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
        component: () => import('pages/processes/edit/ProcessIdEditPage.vue'),
        props: true,
        children: [
          { path: '/processes/edit/:id/info', component: () => import('pages/processes/edit/{processId}/ProcessInfoEditPage.vue'), props: true },
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
        component: () => import('pages/admin/AdminHomePage.vue'),
      },
      {
        path: '/admin/users',
        component: () => import('pages/admin/UsersPage.vue'),
      },
      {
        path: '/admin/users/:id',
        component: () => import('pages/admin/users/UserIdPage.vue'),
        props: true,
        children: [
          {
            path: '/admin/users/:id/info',
            component: () => import('pages/admin/users/{userId}/UserInfoPage.vue'),
            props: true,
          },
          {
            path: '/admin/users/:id/permissions',
            component: () => import('pages/admin/users/{userId}/UserPermissionsPage.vue'),
            props: true,
          },
        ],
      },
    ],
    meta: {
      isAdmin: true,
    },
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
