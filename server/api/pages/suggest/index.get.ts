export default eventHandler(async () => {
  const keys = await useKV().keys("residx-suggest");

  if (!keys) {
    throw createError({
      statusCode: 404,
      message: "No suggestions found",
    });
  };

  const suggestions: any[] = [];
  for (const key of keys) {
    const s = await useKV().get(key);
    suggestions.push({ key, ...s });
  }

  return suggestions;
});
