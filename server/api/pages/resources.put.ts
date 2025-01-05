export default eventHandler(async (event) => {
  const { key, data } = await readBody(event);
  const index = await hubKV().get("resource-index") as Array<any>;

  const x = index.findIndex(item => item.key === key);
  x > -1 ? index[x].data = data : index.push({ key, data });

  await hubKV().set("resource-index", index);

  return { key, data };
});
