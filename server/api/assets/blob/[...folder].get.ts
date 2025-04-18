export default eventHandler({
  onRequest: [requirePermission(AuthPermission.Admin)],
  handler: async (event) => {
    const { folder } = event.context.params || {};
    let cursor;
    let length = 0;

    do {
      const res = await useBlob().list({ prefix: `akresource/${folder}`, cursor });
      length += res.objects.length;
      cursor = res.truncated ? res.cursor : undefined;
    } while (cursor);

    return length;
  }
});
