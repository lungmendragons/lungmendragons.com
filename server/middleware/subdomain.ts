// https://github.com/zernonia/keypress/blob/main/server/middleware/subdomain.ts
export default defineEventHandler((event) => {
  const hostname = event.node.req.headers.host || "lungmendragons.com";
  // console.log("hostname", hostname);

  const mainDomain = [ "localhost:3000", "lungmendragons.com" ];

  if (!mainDomain.includes(hostname)) {
    const currentHost =
      process.env.NODE_ENV === "production"
        ? hostname.replace(".lungmendragons.com", "")
        : hostname.replace(".localhost:3000", "");

    console.log({ currentHost });
    event.context.subdomain = currentHost;
  }
});
