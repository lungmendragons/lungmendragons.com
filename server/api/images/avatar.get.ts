export default cachedEventHandler(async () => {
  const { objects } = await useBlob().list({
    limit: 1000,
    include: [ "httpMetadata" ],
    prefix: "avatar/",
  });

  return objects;
  // return { blobs, folders };
}, {
  maxAge: 3600, // 1 hour
  getKey: event => event.path,
});
