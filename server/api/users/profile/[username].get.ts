export default eventHandler(async (event) => {
  const { username } = event.context.params || {};
  if (!username) {
    throw createError({
      statusCode: 400,
      message: "Missing username",
    });
  };

  const db = useDB();
  const result = await db
    .prepare("SELECT name, image, flair, youtube, bilibili, discord, bluesky, twitter, reddit, createdAt FROM user WHERE username = ?1 COLLATE NOCASE")
    .bind(username)
    .first();

  return result;
});
