import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';

import { useSessionStore } from 'src/stores/session-store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({  }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  // GUARDS
  Router.beforeEach((to, from, next) => {
    const sessionStore = useSessionStore();
    // console.log('......', sessionStore.isLoggedIn, to.)

      if(to.meta.requiresAuth) {
        // If logged in
        if(sessionStore.isLoggedIn) {
          next();
        } else {
          next(`/login?redirect=${to.path}`);
        }

      } else {
        next();
      }

  });

  return Router
})
