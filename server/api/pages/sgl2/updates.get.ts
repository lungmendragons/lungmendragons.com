export default eventHandler(async () => {
  const updates = await hubKV().get("sgl2-update-log");

  if (!updates) {
    throw createError({
      statusCode: 404,
      message: "updates not found",
    });
  };

  return updates;
});
