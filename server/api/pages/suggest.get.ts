export default eventHandler(async () => {
  const keys = await hubKV().keys("residx-suggest");

  if (!keys) {
    throw createError({
      statusCode: 404,
      message: "No suggestions found",
    });
  };

  const suggestions: any[] = [];
  for (const key of keys) {
    const s = await hubKV().get(key);
    suggestions.push(s);
  }

  return suggestions;
});
