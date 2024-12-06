export default eventHandler(async (event) => {
  const { id } = event.context.params || {};
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing user ID",
    });
  };

  const db = hubDatabase();
  // await db.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, text TEXT, created_at INTEGER)");
  const result = await db.prepare("SELECT name, image, youtube, bilibili, discord, bluesky, twitter, reddit FROM user WHERE id = ?1").bind(id).first();

  return result;
});
