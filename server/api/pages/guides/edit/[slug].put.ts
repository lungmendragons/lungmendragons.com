export default eventHandler(async (event) => {
  const { slug } = event.context.params || {};
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Missing slug",
    });
  };

  const { body } = await readBody(event);

  await hubKV().set(`guides:${slug}`, body);

  return { slug, body };
});
