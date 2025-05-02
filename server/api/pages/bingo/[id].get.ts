export default eventHandler(async (event) => {
  const { id } = event.context.params || {};

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "missing game id",
    });
  };

  const bingo = await useKV().get(`bingo:${id}`);

  if (!bingo) {
    throw createError({
      statusCode: 404,
      message: `bingo game <${id}> not found`,
    });
  };

  return bingo;
});