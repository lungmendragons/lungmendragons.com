export default eventHandler(async () => {
  // const { blobs } = await hubBlob().list();
  const { blobs } = await hubBlob().list({
    prefix: "avatar/",
  });

  return blobs;
  // return { blobs, folders };
});
