export default cachedEventHandler(async () => {
  // const { blobs } = await hubBlob().list();
  const { blobs } = await hubBlob().list({
    prefix: "avatar/",
  });

  return blobs;
  // return { blobs, folders };
}, {
  maxAge: 3600, // 1 hour
  getKey: event => event.path,
});
