import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { useCurrentUserStore } from 'src/modules/appUsers/stores/CurrentUserStore';
import { Crud, RoutePermission } from 'src/modules/permissions/models/Permission';
import routes from './routes';
import { notifyErrorI18n } from '../services/NotifyService';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to) => {
    // Step 1: check token
    const token = localStorage.getItem('token');
    if (to.path === '/login' && !!token) {
      return '/';
    }
    if (to.path !== '/login' && !token) {
      return '/login';
    }
    // After token check, login does not need to do any check, just let it pass
    if (to.path === '/login') {
      return true;
    }
    // Step 2: get user info
    const currentUserStore = useCurrentUserStore();
    if (currentUserStore.appUser.id === 0) {
      Promise.all([
        currentUserStore.getCurrentUser(),
        currentUserStore.getCurrentPermissions(),
      ]);
    }
    // If page is admin required
    if (to.meta.isAdmin) {
      if (currentUserStore.appUser.isAdmin) {
        return true;
      }
      notifyErrorI18n('permissions.accessDenied');
      return '/';
    }
    // Step 3: check route permission
    if (!currentUserStore.appUser.isAdmin && to.meta.permissions) {
      const permissions = to.meta.permissions as RoutePermission[];
      for (let i = 0; i < permissions.length; i += 1) {
        const permission = permissions[i];
        const targetPermission = currentUserStore.permissions.find(
          (p) => p.objectType === permission.objectType,
        );
        if (!targetPermission) {
          notifyErrorI18n('permissions.accessDenied');
          return '/';
        }
        const crudsPermission: Record<Crud, boolean> = {
          create: targetPermission.createPermitted,
          read: targetPermission.readPermitted,
          update: targetPermission.updatePermitted,
          delete: targetPermission.deletePermitted,
        };
        let denied = false;
        permission.cruds.forEach((crud) => {
          if (!crudsPermission[crud]) {
            denied = true;
          }
        });
        if (denied) {
          notifyErrorI18n('permissions.accessDenied');
          return '/';
        }
      }
    }
    return true;
  });

  return Router;
});
