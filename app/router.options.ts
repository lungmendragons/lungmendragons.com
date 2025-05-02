import type { RouterOptions } from "@nuxt/schema";

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterOptions>{
  routes: (_routes) => {
    const { ssrContext } = useNuxtApp();
    const subdomain = useSubdomain();
    if (ssrContext?.event.context.subdomain) subdomain.value = ssrContext?.event.context.subdomain;

    if (subdomain.value) {
      const bingoRoute = _routes.filter((i) => i.path.includes("/bingo") && !i.path.includes("/bingo3"));
      console.log("bingoRoute", bingoRoute);
      const bingoRouteMapped = bingoRoute.map((i) => ({
        ...i,
        path: i.path === "/bingo" ? i.path.replace("/bingo", "/") : i.path.replace("/bingo/", "/"),
        name: i.name || "index",
      }));

      console.log("bingoRouteMapped", bingoRouteMapped);
      return bingoRouteMapped;
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
}