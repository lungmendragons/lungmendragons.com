export default eventHandler(async (event) => {
  const { username } = event.context.params || {};
  if (!username) {
    throw createError({
      statusCode: 400,
      message: "Missing username",
    });
  };

  const db = hubDatabase();
  const result = await db
    .prepare("SELECT name, image, youtube, bilibili, discord, bluesky, twitter, reddit, createdAt FROM user WHERE username = ?1 COLLATE NOCASE")
    .bind(username)
    .first();

  return result;
});
