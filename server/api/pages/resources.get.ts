export default cachedEventHandler(async () => {
  const index = await hubKV().get("resource-index");

  if (!index) {
    throw createError({
      statusCode: 404,
      message: "Resource index not found",
    });
  };

  return index;
}, {
  maxAge: 300, // 5 minutes
  getKey: event => event.path,
});
