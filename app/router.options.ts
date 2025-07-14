import type { RouterOptions } from "@nuxt/schema";

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterOptions>{
  routes: (routes) => {
    const { ssrContext } = useNuxtApp();
    const subdomain = useSubdomain();
    if (ssrContext?.event.context.subdomain)
      subdomain.value = ssrContext?.event.context.subdomain;

    if (subdomain.value) {
      const path = `/subdomain/${subdomain.value}/`;
      const index = path.slice(0, path.length - 1);
      return routes.values().map((v) => {
        let newPath: string;
        if (v.path.startsWith(path)) {
          newPath = v.path.slice(path.length - 1);
        } else if (v.path === index) {
          newPath = "/";
        } else {
          return undefined;
        }
        return {
          ...v,
          path: newPath,
        };
      }).filter(v => !!v).toArray();
    } else {
      return routes.filter(v => !v.path.startsWith("/subdomain/"));
    }
  },

  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) return savedPosition
  //   if (to.hash) {
  //     const el = document.querySelector(to.hash) as HTMLElement
  //     return { left: 0, top: (el?.offsetTop ?? 0) - 30, behavior: "smooth" }
  //   }

  //   if (to.fullPath === from.fullPath) return
  //   return { left: 0, top: 0, behavior: "smooth" }
  // },
};
