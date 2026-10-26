import { defineRouter } from '#q-app';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from '../stores/authStore';

export default defineRouter(() => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  Router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return '/login';
    }

    if ((to.path === '/login' || to.path === '/') && authStore.isAuthenticated) {
      return authStore.isAdmin ? '/admin/books' : '/user/dashboard';
    }

    if (to.path.startsWith('/admin') && authStore.isAuthenticated && !authStore.isAdmin) {
      return '/user/dashboard';
    }

    if (to.path.startsWith('/user') && authStore.isAuthenticated && authStore.isAdmin) {
      return '/admin/books';
    }
  });

  return Router;
});