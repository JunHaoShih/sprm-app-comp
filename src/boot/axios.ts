import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Notify } from 'quasar';
import { useCurrentUserStore } from 'src/modules/appUsers/stores/CurrentUserStore';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  timeout: 5000,
});

export default boot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  api.interceptors.request.use((config) => {
    // Add token to header if exist
    const currentUserStore = useCurrentUserStore();
    const token = currentUserStore.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error));

  api.interceptors.response.use((response) => response, async (error) => {
    if (error.response.status === 401) {
      // Try refresh token
      /* const refreshToken = localStorage.getItem('token');
      if (refreshToken) {
        const currentUserStore = useCurrentUserStore();
        const success = await currentUserStore.tryRefreshAccessToken(refreshToken);
        const originalRequest = error.config;
        if (success) {
          return api(originalRequest);
        }
        // If token is changed, it means it is already refreshed
        if (refreshToken !== localStorage.getItem('token')) {
          return api(originalRequest);
        }
      } */
      // Remove token and redirect to login page if unauthorized
      localStorage.removeItem('token');
      await router.push('/login');
      return Promise.reject(error);
    }
    if (error.response) {
      return Promise.reject(error);
    }

    let message = '';
    if (error.request) {
      // The request was made but no response was received
      message = 'Error: No response';
    } else {
      // Something happened in setting up the request that triggered an Error
      message = 'Something went wrong';
    }
    Notify.create({
      message,
      color: 'red',
      icon: 'error',
    });
    return Promise.reject(error);
  });
});

export { api };
