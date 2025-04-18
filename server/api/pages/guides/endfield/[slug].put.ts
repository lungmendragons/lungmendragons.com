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

    if (await useKV().has(`guides-endfield:${slug}`)) {
      throw createError({
        statusCode: 409,
        message: "Slug already exists",
      });
    }

    const { body } = await readBody(event);
    const metadata = {
      title: body.title,
      description: body.description,
      author: body.author,
      time: body.time,
    };

    const index = await useKV().get("guides-endfield-index") as Array<any>;

    if (!index) {
      await useKV().set("guides-endfield-index", [{ key: slug, metadata }]);
    } else {
      const x = index.findIndex(item => item.key === slug);
      x > -1 ? index[x].data = metadata : index.push({ key: slug, metadata });
    }

    await useKV().set(`guides-endfield:${slug}`, body);
    await useKV().set("guides-endfield-index", index);

    return { slug, body };
  }
});
