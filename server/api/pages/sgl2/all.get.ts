export default cachedEventHandler(async () => {
  const reg = await useKV().get("sgl2-registration");
  const qf = await useKV().get("sgl2-live-qualifiers");

  if (!reg || !qf) {
    throw createError({
      statusCode: 404,
      message: "SGL2 entries not found",
    });
  };

  return { reg, qf };
}, {
  maxAge: 300, // 5 minutes
  getKey: event => event.path,
});
