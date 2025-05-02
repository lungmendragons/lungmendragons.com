export default eventHandler({
  // onRequest: [requirePermission(AuthPermission.Writer)],
  handler: async (event) => {
    const { id } = event.context.params || {};

    if (!id) {
      throw createError({
        statusCode: 400,
        message: "Missing id",
      });
    };

    // if (await useKV().has(`bingo:${id}`)) {
    //   throw createError({
    //     statusCode: 409,
    //     message: "id already exists",
    //   });
    // }

    const body = await readBody(event);
    await useKV().set(`bingo:${id}`, body);

    return { id, body };
  }
});
