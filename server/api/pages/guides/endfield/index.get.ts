export default cachedEventHandler(async () => {
  const guides = await useKV().get("guides-endfield-index");

  if (!guides) {
    throw createError({
      statusCode: 404,
      message: "No guides found",
    });
  };

  return guides;
}, {
  maxAge: 300, // 5 minutes
  getKey: event => event.path,
});
