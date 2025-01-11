export default eventHandler(async (event) => {
  const { folder } = event.context.params || {};
  let cursor;
  let length = 0;

  do {
    const res = await hubBlob().list({ prefix: `akresource/${folder}`, cursor });
    length += res.blobs.length;
    cursor = res.cursor;
  } while (cursor);

  return length;
});
