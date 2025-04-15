export default eventHandler(async (event) => {
  const { id } = event.context.params || {};
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing user ID",
    });
  };

  const socials = await readBody(event);

  const db = useDB();
  await db
    .prepare("UPDATE user SET youtube = ?2, bilibili = ?3, discord = ?4, bluesky = ?5, twitter = ?6, reddit = ?7, flair = ?8 WHERE id = ?1")
    .bind(
      id,
      socials.youtube,
      socials.bilibili,
      socials.discord,
      socials.bluesky,
      socials.twitter,
      socials.reddit,
      socials.flair,
    )
    .first();
});
