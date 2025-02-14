export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/" && to.fullPath.startsWith("/#/"))
    return navigateTo(to.hash.slice(1));
  if (to.path === "/sgl")
    return navigateTo("/sgl2");
});
