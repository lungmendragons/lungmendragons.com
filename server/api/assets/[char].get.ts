export default cachedEventHandler(async (event) => {
  const { char } = event.context.params || {};
  if (!char) {
    throw createError({ statusCode: 400, statusMessage: "Missing operator." });
  };

  const { blobs } = await hubBlob().list({
    prefix: `akresource/charpack/${char}`,
  });

  return { blobs, char };
}, {
  maxAge: 3600, // 1 hour
  getKey: event => event.path,
});
