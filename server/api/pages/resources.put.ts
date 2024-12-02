export default eventHandler(async (event) => {
  const { key, data } = await readBody(event);

  await hubKV().set(`resourceindex:${key.slice(-8)}`, data);

  return { key, data };
});
