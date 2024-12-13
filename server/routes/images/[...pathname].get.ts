export default cachedEventHandler(async (event) => {
  const { pathname } = event.context.params || {};

  // setHeader(event, "Content-Security-Policy", "default-src 'none';");
  return hubBlob().serve(event, pathname);
}, {
  maxAge: 3600, // 1 hour
  getKey: event => event.path,
});
