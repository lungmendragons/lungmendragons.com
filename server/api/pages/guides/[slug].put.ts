export default eventHandler(async (event) => {
  const { slug } = event.context.params || {};
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Missing slug",
    });
  };

  if (await hubKV().has(`guides:${slug}`)) {
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

  const index = await hubKV().get("guides-index") as Array<any>;

  const x = index.findIndex(item => item.key === slug);
  x > -1 ? index[x].data = metadata : index.push({ key: slug, metadata });

  await hubKV().set(`guides:${slug}`, body);
  await hubKV().set("guides-index", index);

  return { slug, body };
});
