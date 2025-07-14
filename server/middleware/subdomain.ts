// https://github.com/zernonia/keypress/blob/main/server/middleware/subdomain.ts

const regex = /(?:(.*?)\.)?(?:[0-9a-f]+-lungmendragons-com\.lungmendragons\.workers\.dev|lungmendragons\.com|localhost:\d+)/;
export default defineEventHandler((event) => {
  const hostname = event.node.req.headers.host || "lungmendragons.com";

  const match = regex.exec(hostname);

  if (match && match[1]) {
    event.context.subdomain = match[1];
  }
});
