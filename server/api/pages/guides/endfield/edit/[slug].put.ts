export default eventHandler({
  onRequest: [requirePermission(AuthPermission.Writer)],
  handler: async (event) => {
    const { slug } = event.context.params || {};
    if (!slug) {
      throw createError({
        statusCode: 400,
        message: "Missing slug",
      });
    };

    const { body } = await readBody(event);

    await useKV().set(`guides-endfield:${slug}`, body);

    return { slug, body };
  }
});
