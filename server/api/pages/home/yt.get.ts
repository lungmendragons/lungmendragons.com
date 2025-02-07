export default cachedEventHandler(async () => {
  const recent = await hubKV().get("home-yt-recent");

  if (!recent) {
    throw createError({
      statusCode: 404,
      message: "Recent video not found",
    });
  };

  return recent;
}, {
  maxAge: 300, // 5 minutes
  getKey: event => event.path,
});
