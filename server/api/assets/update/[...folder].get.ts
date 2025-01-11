export default eventHandler(async (event) => {
  const { folder } = event.context.params || {};
  const { blobs } = await hubBlob().list({ prefix: folder });
  return blobs.length;
});
