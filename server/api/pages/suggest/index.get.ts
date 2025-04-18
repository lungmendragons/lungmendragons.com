export default eventHandler({
  onRequest: [requirePermission(AuthPermission.Admin)],
  handler: async () => {
    const keys = await useKV().keys("residx-suggest");

    if (!keys) {
      throw createError({
        statusCode: 404,
        message: "No suggestions found",
      });
    };

    const suggestions: any[] = [];
    for (const key of keys) {
      const s = await useKV().get(key) as object;
      suggestions.push({ key, ...s });
    }

    return suggestions;
  }
});
