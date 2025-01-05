import type { StorageValue } from "unstorage";

export default eventHandler(async () => {
  const keys = await hubKV().keys("guides");

  if (!keys.length) {
    throw createError({
      statusCode: 404,
      message: "No keys found",
    });
  };

  const KVs: StorageValue[] = [];
  for (const key of keys) {
    const data = await hubKV().get(key) as any;
    const metadata = {
      title: data.title,
      description: data.description,
      author: data.author,
      time: data.time,
    };
    KVs.push({ key: key.slice(7), metadata });
  };

  await hubKV().set("guides-index", KVs);

  return "KV set: guides-index";
});
