export default eventHandler(async (event) => {
  const { id } = event.context.params || {};
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing user ID",
    });
  };

  const db = hubDatabase();
  const result = await db
    .prepare("SELECT name, image, flair, youtube, bilibili, discord, bluesky, twitter, reddit FROM user WHERE id = ?1")
    .bind(id)
    .first();

  return result;
});
