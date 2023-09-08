import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { useCurrentUserStore } from 'src/modules/appUsers/stores/CurrentUserStore';
import { Crud, Permission, RoutePermission } from 'src/modules/permissions/models/Permission';
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

  /**
   * Check if user has reuqired permission
   * @param permissions The permissions this route needs
   * @param userPermissions User's permissions
   * @returns If user has required permission in this route
   */
  function hasPermission(
    permissions: RoutePermission[],
    userPermissions: Permission[],
  ) {
    for (let i = 0; i < permissions.length; i += 1) {
      const permission = permissions[i];
      const targetPermission = userPermissions.find(
        (p) => p.objectType === permission.objectType,
      );
      if (!targetPermission) {
        return false;
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
        return false;
      }
    }
    return true;
  }

  Router.beforeEach(async (to, from) => {
    // Step 1: check token
    const refreshToken = localStorage.getItem('token');
    if (to.path === '/login' && !!refreshToken) {
      return '/';
    }
    if (to.path !== '/login' && !refreshToken) {
      return '/login';
    }
    // After token check, login does not need to do any check, just let it pass
    if (to.path === '/login') {
      return true;
    }
    // Use refresh token to get access token if possible
    const currentUserStore = useCurrentUserStore();
    if (!currentUserStore.accessToken) {
      if (refreshToken) {
        const success = await currentUserStore.tryRefreshAccessToken(refreshToken);
        if (!success) {
          currentUserStore.logout();
          return '/login';
        }
        currentUserStore.setRefreshInterval();
      }
    }
    // Step 2: get user info
    if (currentUserStore.appUser.id === 0) {
      await Promise.all([
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
      return from.fullPath;
    }
    // Step 3: check route permission
    if (!currentUserStore.appUser.isAdmin && to.meta.permissions) {
      const permissions = to.meta.permissions as RoutePermission[];
      const hasAccess = hasPermission(permissions, currentUserStore.permissions);
      if (!hasAccess) {
        notifyErrorI18n('permissions.accessDenied');
        return from.fullPath;
      }
    }
    return true;
  });

  return Router;
});
